import { create } from "zustand";

import { BleSlice, createBleSlice } from "./ble-slice";
import { ThemeSlice, createThemeSlice } from "./theme-slice";

export const useStore = create<BleSlice & ThemeSlice>()((...stateFn) => ({
  ...createBleSlice(...stateFn),
  ...createThemeSlice(...stateFn),
}));
