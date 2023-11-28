import { FC, ReactNode, createContext, useContext } from "react";

import { AccessUser, useUserData, userSchema } from "../hooks/use-user-data";
import { saveToStorage } from "../lib/utils";

interface UserContextProps {
  status: "loading" | "error" | "success" | string;
  user?: AccessUser;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { status, data } = useUserData();

  if (status === "loading") {
    return (
      <UserContext.Provider value={{ status: "loading" }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (status === "error") {
    return (
      <UserContext.Provider value={{ status: "error" }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (!data) {
    return (
      <UserContext.Provider value={{ status: "error" }}>
        {children}
      </UserContext.Provider>
    );
  }

  const providerValue = {
    status,
    user: userSchema.parse(data),
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
