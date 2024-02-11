import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { FC, ReactNode, createContext, useContext } from "react";

import { AccessUser, useUserData } from "@/hooks/use-user-data";

import { firebaseAuth } from "@/lib/firebase-config";
import { saveToStorage } from "@/lib/utils";

interface UserContextProps {
  status: "loading" | "error" | "success" | string;
  user?: AccessUser;
  submitPasscode: (passcode: string) => Promise<void>;
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

    const authed = await LocalAuthentication.authenticateAsync({
      promptMessage: "Please authenticate to continue",
    });
    
    if (!authed.success) {
      throw new Error("Authentication failed");
    }

    passcode = passcode.toUpperCase();

    try {
      const authUser = firebaseAuth.currentUser;
      if (!authUser) {
        throw new Error("No user found");
      }

      const token = await authUser.getIdToken();
      const apiUrl = Constants.expoConfig.extra?.authApiUrl;

      const res = await fetch(`${apiUrl}/users/update-passcode`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          passcode,
        }),
      });

      if (!res.ok) {
        const data = await res.json();

        throw new Error(
          data.message ?? "Something went wrong while creating the user"
        );
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
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
    user: AccessUser.parse(data),
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
