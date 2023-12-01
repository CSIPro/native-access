import { FC, ReactNode, createContext, useContext } from "react";

import bcrypt from "react-native-bcrypt";

import { AccessUser, useUserData, userSchema } from "../hooks/use-user-data";
import { saveToStorage } from "../lib/utils";

interface UserContextProps {
  status: "loading" | "error" | "success" | string;
  user?: AccessUser;
  validatePasscode: (passcode: string) => Promise<boolean>;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { status, data } = useUserData();

  const validatePasscode = async (passcode: string) => {
    if (!data) {
      throw new Error("No user data found");
    }

    passcode = passcode.toUpperCase();
    const user = data as AccessUser;

    const valid = await bcrypt.compareSync(passcode, user.passcode);

    return valid;
  };

  if (status === "loading") {
    return (
      <UserContext.Provider value={{ status: "loading", validatePasscode }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (status === "error") {
    return (
      <UserContext.Provider value={{ status: "error", validatePasscode }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (!data) {
    return (
      <UserContext.Provider value={{ status: "error", validatePasscode }}>
        {children}
      </UserContext.Provider>
    );
  }

  const providerValue = {
    status,
    user: userSchema.parse(data),
    validatePasscode,
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
