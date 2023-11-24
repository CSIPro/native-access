import { Buffer } from "buffer";
import * as LocalAuthentication from "expo-local-authentication";
import { FC, ReactNode, createContext, useContext, useState } from "react";
import { PermissionsAndroid } from "react-native";
import AES from "react-native-aes-crypto";
import { BleManager, Device, ScanMode, State } from "react-native-ble-plx";

import { generateNonce } from "../lib/utils";

const scanDuration = 20000;

export enum ScanState {
  scanning,
  connecting,
  paused,
  stopped,
}

interface BLEContextProps {
  manager: BleManager;
  bluetoothState: State;
  scanState: ScanState;
  devices: Device[];
  connect: (device: Device) => void;
  startAutoScan: () => void;
  stopScan: () => void;
  // startScan: () => void;
}

const BLEContext = createContext<BLEContextProps | null>(null);

export const BLEContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [btState, setBtState] = useState<State>(State.Unknown);
  const [scanState, setScanState] = useState<ScanState>(ScanState.stopped);
  const [devices, setDevices] = useState<Device[]>([]);

  const manager = new BleManager();

  manager.onStateChange((state) => {
    setBtState(state);
  }, true);

  const startAutoScan = async () => {
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

    setDevices([]);
    startScan();
  };

  const startScan = () => {
    setScanState(ScanState.scanning);
    manager.startDeviceScan(
      ["4655318c-0b41-4725-9c64-44f9fb6098a2"],
      { scanMode: ScanMode.Balanced },
      (error, device) => {
        if (error) {
          if (error.name === "BleError") {
            setScanState(ScanState.stopped);
          }

          return;
        }

        if (!device) {
          return;
        }

        setDevices((prev) => {
          if (prev.some((d) => d.id === device.id)) {
            return prev;
          }

          const updatedList = [...prev, device].sort((a, b) => {
            if (a.localName < b.localName) {
              return -1;
            } else if (a.localName > b.localName) {
              return 1;
            }

            return 0;
          });

          return updatedList;
        });
      }
    );
  };

  const stopScan = () => {
    manager.stopDeviceScan();
    setTimeout(() => setDevices([]), 5000);
    setScanState(ScanState.stopped);
  };

  const connect = (device: Device) => {
    setScanState(ScanState.connecting);

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
                      startAutoScan();
                    });
                })
                .catch((error) => {
                  console.log(error);
                  startAutoScan();
                });
            })
            .catch((error) => {
              console.log(error);
              setScanState(ScanState.stopped);
            });
        })
        .catch((error) => {
          console.log(error);
          startAutoScan();
        });
    }, 50);
  };

  const encryptData = async () => {
    const nonce = Buffer.from(generateNonce(16)).toString("base64");
    const uid = "oXBMtmcv2RSoTfuBwiJMNNAtHFK2";
    const passcode = "112C83";
    const expiration = new Date().getTime() + 15 * 1000;
    const concat = `${nonce}:${uid}:${passcode}:${expiration}`;

    const crypt = Buffer.from(
      await AES.encrypt(
        concat,
        Buffer.from("ACCESS_K6zsLWe.4eDnA40x.do4mg*A2").toString("hex"),
        Buffer.from("csIPrO/aCCeSS.==").toString("hex"),
        "aes-256-cbc"
      )
    ).toString("base64");

    return crypt;
  };

  const providerValue = {
    manager,
    bluetoothState: btState,
    scanState,
    devices: [...devices],
    connect,
    startAutoScan: startAutoScan,
    stopScan,
  };

  return (
    <BLEContext.Provider value={providerValue}>{children}</BLEContext.Provider>
  );
};

export const useBLE = () => {
  const context = useContext(BLEContext);

  if (!context) {
    throw new Error("useBLE must be used within a BLEContextProvider");
  }

  return context;
};
