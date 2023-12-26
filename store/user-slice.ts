import bcrypt from "bcryptjs";
import { StateCreator } from "zustand";

import { AccessUser } from "../hooks/use-user-data";

export interface UserSlice {
  user: {
    user?: AccessUser;
    setUser: (user: AccessUser) => void;
    submitPasscode: (passcode: string) => Promise<boolean>;
  };
}

export const createUserSlice: StateCreator<UserSlice> = (set, get) => {
  return {
    user: {
      user: undefined,
      setUser: (user) => {
        set((state) => ({
          user: {
            ...state.user,
            user,
          },
        }));
      },
      submitPasscode: async (passcode) => {
        if (!get().user.user) {
          throw new Error("User data not found");
        }

        passcode = passcode.trim().toUpperCase();
        const { user } = get().user;

        return new Promise<boolean>((resolve, reject) => {
          bcrypt.compare(
            passcode,
            user.passcode,
            (error: Error, res: boolean) => {
              if (error) {
                console.log(error);
                reject(error);
              }

              if (res === true) {
                resolve(true);
              } else {
                reject(new Error("Passcode is incorrect"));
              }
            }
          );
        });
      },
    },
  };
};
