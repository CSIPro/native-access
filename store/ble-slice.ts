import { Buffer } from "buffer";

import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device, ScanMode, State } from "react-native-ble-plx";
import AES from "react-native-aes-crypto";
import { z } from "zod";
import { StateCreator } from "zustand";

import { generateNonce, getFromStorage, saveToStorage } from "../lib/utils";

export interface BleSlice {
  selectedRoom?: string;
  setSelectedRoom: (roomName: string) => void;
  bluetoothState: State;
  scanState: ScanState;
  devices: Device[];
  openPasscodeModal: boolean;
  connect: (device: Device) => void;
  scan: () => void;
  stopScan: ({ immediate }: { immediate: boolean }) => void;
  onClosePasscodeModal: () => void;
  autoConnect: boolean;
  setAutoConnect: (autoConnect: boolean) => void;
}

export const ScanState = z.enum(["idle", "scanning", "connecting"]);
export type ScanState = z.infer<typeof ScanState>;

export const createBleSlice: StateCreator<BleSlice> = (set, get) => {
  const manager = new BleManager();
  const scanDuration = 9000;
  let scanTimeout: NodeJS.Timeout;

  manager.onStateChange((state) => {
    set({ bluetoothState: state });
  }, true);

  getFromStorage("BLE_AUTO_CONNECT").then((autoConnect) => {
    if (!!autoConnect) {
      const value = autoConnect === "true";
      get().setAutoConnect(value);
    }
  });

  const startScan = async () => {
    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_COARSE_LOCATION,
      {
        title:
          "This feature needs location permission to scan for BLE devices.",
        message:
          "This feature needs location permission to scan for BLE devices.",
        buttonNeutral: "Ask me later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title:
          "This feature needs location permission to scan for BLE devices.",
        message:
          "This feature needs location permission to scan for BLE devices.",
        buttonNeutral: "Ask me later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title:
          "This feature needs location permission to connect to BLE devices.",
        message:
          "This feature needs location permission to connect to BLE devices.",
        buttonNeutral: "Ask me later",
        buttonNegative: "Cancel",
        buttonPositive: "OK",
      }
    );

    if (get().scanState === ScanState.enum.idle) {
      scanForDevices();
    }
  };

  const scanForDevices = () => {
    set({ scanState: ScanState.enum.scanning });
    manager.startDeviceScan(
      // null,
      ["4655318c-0b41-4725-9c64-44f9fb6098a2"],
      { scanMode: ScanMode.Balanced },
      (error, device) => {
        if (error) {
          if (error.name === "BleError") {
            set({ scanState: ScanState.enum.idle });
          }

          return;
        }

        if (!device) {
          return;
        }

        set((state) => {
          if (state.devices.some((d) => d.id === device.id)) {
            return { devices: state.devices };
          }

          const updatedList = [...state.devices, device].sort((a, b) => {
            if (a.localName < b.localName) {
              return -1;
            } else if (a.localName > b.localName) {
              return 1;
            }

            return 0;
          });

          return { devices: updatedList };
        });
      }
    );

    scanTimeout = setTimeout(
      () => {
        manager.stopDeviceScan();
        set({ scanState: ScanState.enum.idle, devices: [] });
      },
      get().autoConnect ? scanDuration : scanDuration + 6000
    );
  };

  const stopScan = ({ immediate = false }: { immediate?: boolean } = {}) => {
    manager.stopDeviceScan();
    clearTimeout(scanTimeout);

    if (immediate) {
      set({ scanState: ScanState.enum.idle, devices: [] });

      return;
    }

    setTimeout(() => {
      set({ scanState: ScanState.enum.idle, devices: [] });
    }, 5000);
  };

  const connect = async (device: Device) => {
    set({ scanState: ScanState.enum.connecting });

    setTimeout(() => {
      device
        .connect({
          autoConnect: false,
          timeout: 6000,
        })
        .then((connectedDevice) => {
          return connectedDevice.discoverAllServicesAndCharacteristics();
        })
        .then((connectedDevice) => {
          LocalAuthentication.authenticateAsync({
            promptMessage: "Confirm your identity",
          })
            .then((result) => {
              if (!result.success) {
                throw new Error("Authentication failed.");
              }

              encryptData()
                .then((crypt) => {
                  connectedDevice
                    .writeCharacteristicWithResponseForService(
                      Constants.expoConfig.extra?.bleServiceUuid,
                      Constants.expoConfig.extra?.bleCharUuid,
                      Buffer.from(crypt).toString("base64"),
                      "access-attempt"
                    )
                    .then((_) => {
                      connectedDevice.cancelConnection();
                      stopScan();
                    })
                    .catch((error) => {
                      console.log(error);
                      startScan();
                    });
                })
                .catch((error) => {
                  console.log(error);
                  startScan();
                });
            })
            .catch((error) => {
              console.log(error);
              connectedDevice.cancelConnection();
              stopScan();
              set({ scanState: ScanState.enum.idle });
            });
        })
        .catch((error) => {
          console.log(error);
          startScan();
        });
    }, 75);
  };

  const encryptData = async () => {
    const currentDate = new Date();
    const nonce = Buffer.from(generateNonce(16)).toString("base64");
    const uid = await getFromStorage("FIREBASE_UID");
    const expiration = currentDate.getTime() + 45 * 1000;
    const concat = `${nonce}:${uid}:${expiration}`;

    const crypt = Buffer.from(
      await AES.encrypt(
        concat,
        Buffer.from(Constants.expoConfig.extra?.aesKey).toString("hex"),
        Buffer.from(Constants.expoConfig.extra?.aesIv).toString("hex"),
        "aes-256-cbc"
      )
    ).toString("base64");

    return crypt;
  };

  const setAutoConnect = (autoConnect: boolean) => {
    set({ autoConnect });
    saveToStorage("BLE_AUTO_CONNECT", autoConnect ? "true" : "false");
  };

  return {
    setSelectedRoom: (selectedRoom?: string) => set({ selectedRoom }),
    autoConnect: false,
    setAutoConnect,
    bluetoothState: State.Unknown,
    scanState: ScanState.enum.idle,
    devices: [],
    openPasscodeModal: false,
    scan: startScan,
    stopScan,
    connect,
    onClosePasscodeModal: () => set({ openPasscodeModal: false }),
  };
};
