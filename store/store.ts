import { create } from "zustand";

import { BleSlice, createBleSlice } from "./ble-slice";
import { ConfigSlice, createConfigSlice } from "./theme-slice";

export const useStore = create<BleSlice & ConfigSlice>()((...stateFn) => ({
  ...createBleSlice(...stateFn),
  ...createConfigSlice(...stateFn),
}));
