import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import { FC, ReactNode, createContext, useContext } from "react";

import {
  AccessUser,
  NestUser,
  useNestUser,
  useUserData,
} from "@/hooks/use-user-data";

import { firebaseAuth } from "@/lib/firebase-config";
import { NestError, saveToStorage } from "@/lib/utils";
import { SplashScreen } from "@/components/splash/splash";
import { Membership, useMemberships } from "@/hooks/use-membership";
import { useRoomContext } from "./room-context";

interface UserContextProps {
  user?: NestUser;
  membership?: Membership;
  submitPasscode: (passcode: string) => Promise<void>;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { selectedRoom } = useRoomContext();
  const { status, data } = useNestUser();
  const { status: membershipStatus, data: memberships } = useMemberships(
    data?.id
  );

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
      // const apiUrl = Constants.expoConfig.extra?.authApiUrl;
      const apiUrl = "http://148.225.50.130:3000";

      const res = await fetch(`${apiUrl}/users/${data?.id}/update-passcode`, {
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

        const error = NestError.safeParse(data);

        if (error.success) {
          throw new Error(error.data.message);
        }

        throw new Error("Something went wrong while creating the user");
      }
    } catch (error) {
      console.error(error);

      throw error;
    }
  };

  if (status === "loading" || membershipStatus === "loading") {
    return <SplashScreen loading message="Loading user data..." />;
  }

  if (status === "error") {
    return (
      <UserContext.Provider value={{ submitPasscode }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (membershipStatus === "error") {
    return (
      <UserContext.Provider value={{ user: data, submitPasscode }}>
        {children}
      </UserContext.Provider>
    );
  }

  const membership = memberships?.find(
    (membership) => membership.room.id === selectedRoom
  );

  const providerValue = {
    user: data,
    membership,
    submitPasscode,
  };

  saveToStorage("FIREBASE_UID", providerValue.user.authId);

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
