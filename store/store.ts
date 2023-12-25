import { create } from "zustand";

import { BleSlice, createBleSlice } from "./ble-slice";

export const useStore = create<BleSlice>()((...stateFn) => ({
  ...createBleSlice(...stateFn),
}));
