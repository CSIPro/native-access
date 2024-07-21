import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";

import { AccessUser } from "@/hooks/use-user-data";

import { firestore } from "./firebase-config";

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
