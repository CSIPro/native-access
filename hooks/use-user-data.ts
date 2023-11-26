import { Timestamp, doc } from "firebase/firestore";
import { useDocumentData } from "react-firebase-hooks/firestore";

import { z } from "zod";

import { firebaseAuth, firestore } from "../lib/firebase-config";

const userRoomRoleSchema = z.object({
  id: z.string(),
  key: z.string(),
  accessGranted: z.boolean().default(false),
  roleId: z.string(),
});

export type UserRoomRole = z.infer<typeof userRoomRoleSchema>;

const userSchema = z.object({
  csiId: z.number(),
  name: z.string(),
  passcode: z.string(),
  unisonId: z.string(),
  createdAt: z.custom<Timestamp>(),
  dateOfBirth: z.custom<Timestamp>(),
  isRoot: z.boolean().optional().default(false),
  role: userRoomRoleSchema,
});

export type AccessUser = z.infer<typeof userSchema>;

export const useUserData = () => {
  const user = firebaseAuth.currentUser;
  const userDoc = doc(firestore, "users", `${user?.uid}a` || "undefined");
  const userRolesDoc = doc(
    firestore,
    "user_roles",
    `${user?.uid}a` || "undefined"
  );

  const [userData, userLoading, userError] = useDocumentData(userDoc);
  const [roles, rolesLoading, rolesError] = useDocumentData(userRolesDoc);

  return {
    user: userData
      ? userSchema.parse({ ...userData, role: userRoomRoleSchema.parse(roles) })
      : undefined,
    loading: userLoading || rolesLoading,
    error: userError || rolesError,
  };
};
