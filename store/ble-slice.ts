import { Buffer } from "buffer";

import Constants from "expo-constants";
import * as Haptics from "expo-haptics";
import * as LocalAuthentication from "expo-local-authentication";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device, ScanMode, State } from "react-native-ble-plx";
import AES from "react-native-aes-crypto";
import { z } from "zod";
import { StateCreator } from "zustand";

import {
  generateNonce,
  getFromStorageAsync,
  saveToStorageAsync,
  sleep,
} from "../lib/utils";

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
  authExpiration?: number;
}

export const ScanState = z.enum(["idle", "scanning", "connecting"]);
export type ScanState = z.infer<typeof ScanState>;

export const createBleSlice: StateCreator<BleSlice> = (set, get) => {
  const serviceUuid = Constants.expoConfig.extra?.bleServiceUuid;
  const charUuid = Constants.expoConfig.extra?.bleCharUuid;
  const cryptIv = Constants.expoConfig.extra?.aesIv;
  const cryptKey = Constants.expoConfig.extra?.aesKey;

  const manager = new BleManager();
  const scanDuration = 12000;
  let scanTimeout: NodeJS.Timeout;
  let connectionAttempts = 0;
  const attemptLimit = 5;

  manager.onStateChange((state) => {
    set({ bluetoothState: state });
  }, true);

  getFromStorageAsync("BLE_AUTO_CONNECT").then((autoConnect) => {
    if (!!autoConnect) {
      const value = autoConnect === "true";
      get().setAutoConnect(value);
    }
  });

  getFromStorageAsync("BLE_AUTH_EXPIRATION").then((authExpiration) => {
    if (!!authExpiration) {
      const value = parseInt(authExpiration, 10);
      set({ authExpiration: value });
    }
  });

  const saveAuthExpiration = (expiration: number) => {
    set({ authExpiration: expiration });
    saveToStorageAsync("BLE_AUTH_EXPIRATION", expiration.toString());
  };

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
    connectionAttempts = 0;
    Haptics.selectionAsync();
    set({ scanState: ScanState.enum.scanning });
    manager.startDeviceScan(
      [serviceUuid],
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

  const connectToDevice = async (device: Device) => {
    Haptics.selectionAsync();
    set({ scanState: ScanState.enum.connecting });

    await sleep(125);

    const connectedDevice = await device.connect({
      autoConnect: false,
      timeout: 6000,
    });

    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);

    await connectedDevice.discoverAllServicesAndCharacteristics();

    const currentDate = new Date().getTime();

    if (get().authExpiration && currentDate < get().authExpiration) {
      sendToken(connectedDevice);

      return;
    }

    LocalAuthentication.authenticateAsync({
      promptMessage: "Confirma tu identidad",
    }).then((result) => {
      if (!result.success) {
        throw new Error("Authentication failed.");
      }

      saveAuthExpiration(new Date().getTime() + 3600 * 1000 * 12);

      sendToken(connectedDevice);
    });
  };

  const connect = async (device: Device) => {
    while (connectionAttempts < attemptLimit) {
      console.log("Attempting connection...", connectionAttempts);
      await sleep(250 * connectionAttempts);

      try {
        await connectToDevice(device);

        return;
      } catch (error) {
        console.log(error);
        connectionAttempts += 1;
      }
    }
  };

  const encryptData = async () => {
    const currentDate = new Date();
    const nonce = Buffer.from(generateNonce(16)).toString("base64");
    const uid = await getFromStorageAsync("FIREBASE_UID");
    const expiration = currentDate.getTime() + 45 * 1000;
    const concat = `${nonce}:${uid}:${expiration}:mobile`;

    const crypt = Buffer.from(
      await AES.encrypt(
        concat,
        Buffer.from(cryptKey).toString("hex"),
        Buffer.from(cryptIv).toString("hex"),
        "aes-256-cbc"
      )
    ).toString("base64");

    return crypt;
  };

  const sendToken = (device: Device) => {
    encryptData()
      .then((crypt) => {
        device
          .writeCharacteristicWithResponseForService(
            serviceUuid,
            charUuid,
            Buffer.from(crypt).toString("base64"),
            "access-attempt"
          )
          .then((_) => {
            Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
            device.cancelConnection();
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
  };

  const setAutoConnect = (autoConnect: boolean) => {
    set({ autoConnect });
    saveToStorageAsync("BLE_AUTO_CONNECT", autoConnect ? "true" : "false");
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
