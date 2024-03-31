import { create } from "zustand";

import { BleSlice, createBleSlice } from "./ble-slice";
import { ConfigSlice, createConfigSlice } from "./config-slice";
import { LogsSlice, createLogsSlice } from "./logs-slice";

export const useStore = create<BleSlice & ConfigSlice & LogsSlice>()(
  (...stateFn) => ({
    ...createBleSlice(...stateFn),
    ...createConfigSlice(...stateFn),
    ...createLogsSlice(...stateFn),
  })
);
