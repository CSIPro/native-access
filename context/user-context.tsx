import { FC, ReactNode, createContext, useContext } from "react";

import bcrypt from "bcryptjs";

import { AccessUser, useUserData, userSchema } from "../hooks/use-user-data";
import { saveToStorage } from "../lib/utils";

interface UserContextProps {
  status: "loading" | "error" | "success" | string;
  user?: AccessUser;
  submitPasscode: (passcode: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { status, data } = useUserData();

  const submitPasscode = async (passcode: string) => {
    if (!data) {
      throw new Error("No user data found");
    }

    passcode = passcode.toUpperCase();
    const user = data as AccessUser;

    return new Promise<boolean>((resolve, reject) => {
      bcrypt.compare(passcode, user.passcode, (err: Error, res: boolean) => {
        if (err) {
          console.log(err);
          reject(err);
        }

        if (res === true) {
          resolve(res);
        } else {
          reject(new Error("Incorrect passcode"));
        }
      });
    });
  };

  if (status === "loading") {
    return (
      <UserContext.Provider
        value={{ status: "loading", submitPasscode: submitPasscode }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  if (status === "error") {
    return (
      <UserContext.Provider
        value={{ status: "error", submitPasscode: submitPasscode }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  if (!data) {
    return (
      <UserContext.Provider
        value={{ status: "error", submitPasscode: submitPasscode }}
      >
        {children}
      </UserContext.Provider>
    );
  }

  const providerValue = {
    status,
    user: userSchema.parse(data),
    submitPasscode,
  };

  saveToStorage("FIREBASE_UID", providerValue.user.id);

  return (
    <UserContext.Provider value={providerValue}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
};
