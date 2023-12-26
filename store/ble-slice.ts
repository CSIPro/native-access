import { Buffer } from "buffer";

import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device, ScanMode, State } from "react-native-ble-plx";
import AES from "react-native-aes-crypto";
import { z } from "zod";
import { StateCreator } from "zustand";

import { generateNonce, getFromStorage } from "../lib/utils";

export interface BleSlice {
  ble: {
    bluetoothState: State;
    scanState: ScanState;
    devices: Device[];
    openPasscodeModal: boolean;
    connect: (device: Device) => void;
    scan: () => void;
    stopScan: ({ immediate }: { immediate: boolean }) => void;
    onClosePasscodeModal: () => void;
  };
}

export const ScanState = z.enum(["idle", "scanning", "connecting"]);
export type ScanState = z.infer<typeof ScanState>;

export const createBleSlice: StateCreator<BleSlice> = (set, get) => {
  const manager = new BleManager();
  const scanDuration = 30000;
  let scanTimeout: NodeJS.Timeout;

  manager.onStateChange((bleState) => {
    if (
      bleState === State.PoweredOn &&
      get().ble.bluetoothState !== State.PoweredOn
    ) {
      startScan();
    }

    set((state) => ({
      ble: {
        ...state.ble,
        bluetoothState: bleState,
      },
    }));
  }, true);

  const startScan = async () => {
    const scanPermission = await PermissionsAndroid.request(
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

    const connectPermission = await PermissionsAndroid.request(
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

    if (
      scanPermission !== PermissionsAndroid.RESULTS.GRANTED ||
      connectPermission !== PermissionsAndroid.RESULTS.GRANTED
    ) {
      return;
    }

    scanForDevices();
  };

  const scanForDevices = () => {
    set((state) => ({
      ble: {
        ...state.ble,
        scanState: ScanState.enum.scanning,
      },
    }));
    manager.startDeviceScan(
      // null,
      ["4655318c-0b41-4725-9c64-44f9fb6098a2"],
      { scanMode: ScanMode.Balanced },
      (error, device) => {
        if (error) {
          if (error.name === "BleError") {
            set((state) => ({
              ble: {
                ...state.ble,
                scanState: ScanState.enum.idle,
              },
            }));
          }

          return;
        }

        if (!device) {
          return;
        }

        set((state) => {
          if (state.ble.devices.some((d) => d.id === device.id)) {
            return { devices: state.ble.devices };
          }

          const updatedList = [...state.ble.devices, device].sort((a, b) => {
            if (a.localName < b.localName) {
              return -1;
            } else if (a.localName > b.localName) {
              return 1;
            }

            return 0;
          });

          return {
            ble: {
              ...state.ble,
              devices: updatedList,
            },
          };
        });
      }
    );

    scanTimeout = setTimeout(() => {
      manager.stopDeviceScan();
      set((state) => ({
        ble: {
          ...state.ble,
          scanState: ScanState.enum.idle,
        },
      }));
    }, scanDuration);
  };

  const stopScan = ({ immediate = false }: { immediate?: boolean } = {}) => {
    manager.stopDeviceScan();
    clearTimeout(scanTimeout);

    if (immediate) {
      set((state) => ({
        ble: {
          ...state.ble,
          scanState: ScanState.enum.idle,
          devices: [],
        },
      }));

      return;
    }

    setTimeout(() => {
      set((state) => ({
        ble: {
          ...state.ble,
          scanState: ScanState.enum.idle,
          devices: [],
        },
      }));
    }, 5000);
  };

  const connect = async (device: Device) => {
    const passcode = await getFromStorage("PASSCODE");

    if (!passcode) {
      set((state) => ({
        ble: {
          ...state.ble,
          openPasscodeModal: true,
        },
      }));
      return;
    }

    set((state) => ({
      ble: {
        ...state.ble,
        scanState: ScanState.enum.connecting,
      },
    }));

    setTimeout(() => {
      device
        .connect({
          autoConnect: true,
          timeout: 5000,
        })
        .then((connectedDevice) => {
          return connectedDevice.discoverAllServicesAndCharacteristics();
        })
        .then((connectedDevice) => {
          LocalAuthentication.authenticateAsync()
            .then((result) => {
              if (!result.success) {
                throw new Error("Authentication failed.");
              }

              encryptData()
                .then((crypt) => {
                  connectedDevice
                    .writeCharacteristicWithResponseForService(
                      "4655318c-0b41-4725-9c64-44f9fb6098a2",
                      "4d493467-5cd5-4a9c-8389-2e569f68bb10",
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
              set((state) => ({
                ble: {
                  ...state.ble,
                  scanState: ScanState.enum.idle,
                },
              }));
            });
        })
        .catch((error) => {
          console.log(error);
          startScan();
        });
    }, 75);
  };

  const encryptData = async () => {
    const nonce = Buffer.from(generateNonce(16)).toString("base64");
    const uid = await getFromStorage("FIREBASE_UID");
    const passcode = await getFromStorage("PASSCODE");
    const expiration = new Date().getTime() + 15 * 1000;
    const concat = `${nonce}:${uid}:${passcode}:${expiration}`;

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

  return {
    ble: {
      bluetoothState: State.Unknown,
      scanState: ScanState.enum.idle,
      devices: [],
      openPasscodeModal: false,
      scan: startScan,
      stopScan,
      connect,
      onClosePasscodeModal: () =>
        set((state) => ({
          ble: {
            ...state.ble,
            openPasscodeModal: false,
          },
        })),
    },
  };
};
