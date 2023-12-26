import { create } from "zustand";

import { BleSlice, createBleSlice } from "./ble-slice";
import { RoomsSlice, createRoomsSlice } from "./rooms-slice";
import { RolesSlice, createRolesSlice } from "./roles-slice";
import { UserSlice, createUserSlice } from "./user-slice";

export const useStore = create<
  BleSlice & UserSlice & RoomsSlice & RolesSlice
>()((...stateFn) => ({
  ...createBleSlice(...stateFn),
  ...createUserSlice(...stateFn),
  ...createRoomsSlice(...stateFn),
  ...createRolesSlice(...stateFn),
}));

export const useBLEDevices = () => useStore((state) => state.ble.devices);
export const useBLEState = () => useStore((state) => state.ble.bluetoothState);
export const useBLEScanState = () => useStore((state) => state.ble.scanState);
export const useBLEOpenPasscodeModal = () =>
  useStore((state) => state.ble.openPasscodeModal);
export const useBLEScan = () => useStore((state) => state.ble.scan);
export const useBLEConnect = () => useStore((state) => state.ble.connect);
export const useBLEStopScan = () => useStore((state) => state.ble.stopScan);
export const useBLEClosePasscodeModal = () =>
  useStore((state) => state.ble.onClosePasscodeModal);

export const useStoreRooms = () => useStore((state) => state.rooms.rooms);
export const useStoreUserRooms = () =>
  useStore((state) => state.rooms.userRooms);
export const useSelectedRoom = () =>
  useStore((state) => state.rooms.selectedRoom);
export const useSetRooms = () => useStore((state) => state.rooms.setRooms);
export const useSetUserRooms = () =>
  useStore((state) => state.rooms.setUserRooms);
export const useSetSelectedRoom = () =>
  useStore((state) => state.rooms.setSelectedRoom);

export const useStoreRoles = () => useStore((state) => state.roles.roles);
export const useStoreUserRole = () => useStore((state) => state.roles.userRole);
export const useSetRoles = () => useStore((state) => state.roles.setRoles);
export const useSetUserRole = () =>
  useStore((state) => state.roles.setUserRole);

export const useStoreUser = () => useStore((state) => state.user.user);
export const useSetUser = () => useStore((state) => state.user.setUser);
export const useSubmitPasscode = () =>
  useStore((state) => state.user.submitPasscode);
