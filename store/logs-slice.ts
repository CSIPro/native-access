import * as LocalAuthentication from "expo-local-authentication";

import { StateCreator } from "zustand";

export interface LogsSlice {
  selectedLog?: string;
  setSelectedLog: (id: string) => void;
  clearSelectedLog: () => void;
  deleteConfirmation?: number;
  confirmDeletion: () => Promise<boolean>;
}

export const createLogsSlice: StateCreator<LogsSlice> = (set, get) => {
  const setSelectedLog = (id: string) => {
    set({ selectedLog: id });
  };

  const clearSelectedLog = () => {
    set({ selectedLog: undefined });
  };

  const confirmDeletion = async () => {
    try {
      const authed = await LocalAuthentication.authenticateAsync({
        promptMessage: "Confirma tu identidad",
        cancelLabel: "Cancelar",
      });

      if (!authed.success) {
        return false;
      }

      const date = new Date().getTime() + 30000;
      set({ deleteConfirmation: date });

      return true;
    } catch (error) {
      set({ deleteConfirmation: undefined });

      return false;
    }
  };

  return {
    selectedLog: undefined,
    setSelectedLog,
    clearSelectedLog,
    deleteConfirmation: undefined,
    confirmDeletion,
  };
};
