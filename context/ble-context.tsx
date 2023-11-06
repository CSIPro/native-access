import { FC, ReactNode, createContext, useContext, useState } from "react";
import { PermissionsAndroid } from "react-native";
import { BleManager, Device, ScanMode, State } from "react-native-ble-plx";

const scanDuration = 4000;
const scanInterval = 10000;
const scanLimit = 3;

interface BLEContextProps {
  state: State;
  devices: Device[];
  startAutoScan: () => void;
  // startScan: () => void;
}

const BLEContext = createContext<BLEContextProps | null>(null);

export const BLEContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [btState, setBtState] = useState<State>(State.Unknown);
  const [devices, setDevices] = useState<Device[]>([]);

  const manager = new BleManager();
  let scanCount = 0;
  let interval: NodeJS.Timeout | null = null;

  manager.onStateChange((state) => {
    setBtState(state);
  }, true);

  const startAutoScan = async () => {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
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

    if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
      return;
    }

    startScan();
    interval = setInterval(() => {
      if (scanCount >= scanLimit) {
        cancelInterval();
        return;
      }

      setDevices([]);
      startScan();

      setTimeout(() => {
        manager.stopDeviceScan();
        scanCount++;
      }, scanDuration);
    }, scanInterval);
  };

  const startScan = () => {
    manager.startDeviceScan(
      ["4655318c-0b41-4725-9c64-44f9fb6098a2"],
      { scanMode: ScanMode.LowLatency },
      (error, device) => {
        if (error) {
          console.log(error);
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

  const cancelInterval = () => {
    clearInterval(interval);
  };

  const providerValue = {
    state: btState,
    devices: [...devices],
    startAutoScan: startAutoScan,
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
