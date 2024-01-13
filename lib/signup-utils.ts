import Constants from "expo-constants";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { z } from "zod";

import { AccessUser } from "@/hooks/use-user-data";

import { firebaseAuth, firestore } from "./firebase-config";

export const SignUpForm = z.object({
  name: z
    .string({
      required_error: "Your name is required",
    })
    .min(4, {
      message: "Your name must be at least 4 characters long",
    })
    .max(50, {
      message: "Your name must be at most 50 characters long",
    })
    .optional(),
  unisonId: z
    .string({
      required_error: "Your UniSon ID is required",
    })
    .min(5, {
      message: "Your UniSon ID must be at least 5 digits long",
    })
    .max(9, {
      message: "Your UniSon ID must be at most 9 digits long",
    })
    .regex(/^[0-9]{5,9}$/, {
      message: "Invalid UniSon ID",
    })
    .optional(),
  passcode: z
    .string({
      required_error: "Your passcode is required",
    })
    .min(6, {
      message: "Your passcode must be at least 6 characters long",
    })
    .max(12, {
      message: "Your passcode must be at most 12 characters long",
    })
    .regex(/^(?=.*[\d])(?=.*[A-D])[\dA-D]{4,10}$/, {
      message: "Your passcode must contain numbers and letters from A to D",
    })
    .optional(),
  dateOfBirth: z
    .date({
      required_error: "Your date of birth is required",
    })
    .min(new Date(1900, 0, 1), {
      message: "I don't think you're that old",
    })
    .max(new Date(), {
      message: "Time traveler alert!",
    })
    .optional(),
  room: z.string({
    required_error: "You must select a room",
  }),
});

export type SignUpForm = z.infer<typeof SignUpForm>;

export const unisonIdExists = async (unisonId: string) => {
  const usersCol = collection(firestore, "users");
  const usersQuery = query(usersCol, where("unisonId", "==", unisonId));

  const users = await getDocs(usersQuery);

  return users.docs.length > 0;
};

export const getNextId = async () => {
  const usersCol = collection(firestore, "users");
  const usersQuery = query(usersCol, orderBy("csiId", "desc"), limit(1));
  const userDocs = await getDocs(usersQuery);

  const userSafeParse = AccessUser.safeParse({
    id: userDocs.docs[0].id,
    ...userDocs.docs[0].data(),
  });

  if (userSafeParse.success) {
    return userSafeParse.data.csiId + 1;
  } else {
    throw new Error(
      "Something went wrong while generating your ID. Please, try again."
    );
  }
};

export const createUser = async ({
  name,
  unisonId,
  passcode,
  dateOfBirth,
  room,
}: SignUpForm) => {
  const authUser = firebaseAuth.currentUser;

  if (!authUser) {
    throw new Error("You don't seem to be logged in...");
  }

  try {
    const token = await authUser.getIdToken();
    const apiUrl = Constants.expoConfig.extra?.authApiUrl;

    //TODO: Update the sign-up API
    const res = await fetch(`${apiUrl}/users/add`, {
      method: "POST",
      body: JSON.stringify({
        name,
        unisonId,
        passcode,
        dateOfBirth,
        roomId: room,
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();

    if (!res.ok) {
      throw new Error(
        data.message ?? "Something went wrong while creating the user"
      );
    }

    return data;
  } catch (error) {
    throw new Error(error);
  }
};
