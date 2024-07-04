import {
  DocumentData,
  DocumentReference,
  Timestamp,
  doc,
  getDoc,
  updateDoc,
} from "firebase/firestore";

import { z } from "zod";

import { useFirestore, useFirestoreDocData, useUser } from "reactfire";

import { useRoomContext } from "../context/room-context";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { firebaseAuth } from "@/lib/firebase-config";
import { NestError } from "@/lib/utils";

export const UserRoomRole = z.object({
  id: z.string(),
  key: z.string(),
  accessGranted: z.boolean().default(false),
  roleId: z.string(),
});

export type UserRoomRole = z.infer<typeof UserRoomRole>;

export const AccessUser = z.object({
  id: z.string(),
  csiId: z.number(),
  name: z.string(),
  passcode: z.string(),
  unisonId: z.string(),
  createdAt: z.custom<Timestamp>(),
  dateOfBirth: z.custom<Timestamp>(),
  isRoot: z.boolean().optional().default(false),
  role: UserRoomRole.optional(),
});

export type AccessUser = z.infer<typeof AccessUser>;

export const useUserData = () => {
  const user = useUser();
  const firestore = useFirestore();
  const userDoc = doc(firestore, "users", `${user.data?.uid}` || "undefined");
  const userRoleDoc = doc(
    firestore,
    "user_roles",
    `${user.data?.uid}` || "undefined"
  );

  const { status: userRoomRoleStatus, data: userRoomRoleData } = useUserRole();
  const { status: userStatus, data: userData } = useFirestoreDocData(userDoc, {
    idField: "id",
  });

  const { status: userRoleStatus, data: userRoleData } = useFirestoreDocData(
    userRoleDoc,
    {
      idField: "id",
    }
  );

  if (
    userStatus === "loading" ||
    userRoleStatus === "loading" ||
    userRoomRoleStatus === "loading"
  ) {
    return { status: "loading" };
  }

  if (
    userStatus === "error" ||
    userRoleStatus === "error" ||
    userRoomRoleStatus === "error"
  ) {
    return { status: "error" };
  }

  if (!userData) {
    return { status: "success" };
  }

  const mergedData = {
    ...(userData as Omit<AccessUser, "role" | "isRoot">),
    isRoot: userRoleData?.isRoot || false,
    role: userRoomRoleData,
  };

  return {
    status: userStatus,
    data: mergedData as AccessUser,
  };
};

export const useUserDataWithId = (uid: string | undefined) => {
  const firestore = useFirestore();
  const userQuery = doc(firestore, "users", uid ?? "undefined");
  const userRoleQuery = doc(firestore, "user_roles", uid ?? "undefined");

  const { status: userRoomRoleStatus, data: userRoomRoleData } = useUserRole();
  const { status: userStatus, data: userData } = useFirestoreDocData(
    userQuery,
    {
      idField: "id",
    }
  );

  const { status: userRoleStatus, data: userRoleData } = useFirestoreDocData(
    userRoleQuery,
    {
      idField: "id",
    }
  );

  if (
    userStatus === "loading" ||
    userRoleStatus === "loading" ||
    userRoomRoleStatus === "loading"
  ) {
    return { status: "loading" };
  }

  if (
    userStatus === "error" ||
    userRoleStatus === "error" ||
    userRoomRoleStatus === "error"
  ) {
    return { status: "error" };
  }

  const mergedData = {
    ...userData,
    isRoot: userRoleData?.isRoot || false,
    role: userRoomRoleData,
  } as z.infer<typeof AccessUser>;

  return {
    status: userStatus,
    data: mergedData,
  };
};

export const useMemberQuery = (uid: string | undefined) => {
  const firestore = useFirestore();
  const { selectedRoom } = useRoomContext();
  const userDoc = doc(firestore, "users", uid ?? "undefined");
  const userRoomRoleDoc = doc(
    firestore,
    "user_roles",
    uid ?? "undefined",
    "room_roles",
    selectedRoom || "invalid"
  );

  const { status, data, error } = useQuery({
    queryKey: ["member", uid],
    queryFn: async () => {
      const user = await getDoc(userDoc);
      const userRoomRole = await getDoc(userRoomRoleDoc);

      const userSafeParse = AccessUser.safeParse({
        ...user.data(),
        id: user.id,
        role: { ...userRoomRole.data(), id: userRoomRole.id },
      });

      if (userSafeParse.success) {
        return userSafeParse.data;
      } else {
        console.error(userSafeParse);
        throw new Error("Something went wrong while retrieving user data");
      }
    },
    refetchInterval: 10000,
  });

  return {
    status,
    data,
    error,
    doc: userRoomRoleDoc,
  };
};

export const useAccessUpdate = (uid: string) => {
  const queryClient = useQueryClient();
  const firestore = useFirestore();
  const { selectedRoom } = useRoomContext();
  const userRoomRoleDoc = doc(
    firestore,
    "user_roles",
    uid,
    "room_roles",
    selectedRoom || "invalid"
  );

  const accessMutation = useMutation({
    mutationFn: async (accessGranted: boolean) => {
      await updateDoc(userRoomRoleDoc, {
        accessGranted,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["member", uid]);
    },
  });

  return {
    accessMutation,
  };
};

export const useRoleUpdate = () => {
  const { selectedRoom } = useRoomContext();
  const queryClient = useQueryClient();
  const roleMutation = useMutation({
    mutationFn: async ({
      doc,
      roleId,
    }: {
      doc: DocumentReference<DocumentData>;
      roleId: string;
    }) => {
      await updateDoc(doc, {
        roleId,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["members", selectedRoom]);
    },
  });

  return { roleMutation };
};

export const useUserRole = () => {
  const { selectedRoom } = useRoomContext();
  const user = useUser();
  const firestore = useFirestore();
  const userRoleQuery = doc(
    firestore,
    "user_roles",
    user.data?.uid || "invalid",
    "room_roles",
    selectedRoom || "invalid"
  );

  const { status: userRoleStatus, data: userRoleData } = useFirestoreDocData(
    userRoleQuery,
    {
      idField: "id",
    }
  );

  if (userRoleStatus === "loading") {
    return { status: "loading" };
  }

  if (userRoleStatus === "error") {
    return { status: "error" };
  }

  return {
    status: userRoleStatus,
    data: userRoleData as z.infer<typeof UserRoomRole>,
  };
};

export const useUserRoleWithId = (uid: string) => {
  const { selectedRoom } = useRoomContext();
  const firestore = useFirestore();
  const userRoleDoc = doc(
    firestore,
    "user_roles",
    uid,
    "room_roles",
    selectedRoom || "invalid"
  );

  const { status: userRoleStatus, data: userRoleData } = useFirestoreDocData(
    userRoleDoc,
    {
      idField: "id",
    }
  );

  if (userRoleStatus === "loading") {
    return { status: "loading" };
  }

  if (userRoleStatus === "error") {
    return { status: "error" };
  }

  return {
    status: userRoleStatus,
    doc: userRoleDoc,
    data: userRoleData as z.infer<typeof UserRoomRole>,
  };
};

export const NestUser = z.object({
  id: z.string(),
  firstName: z.string(),
  lastName: z.string(),
  passcode: z.string().optional().nullable(),
  csiId: z.number(),
  unisonId: z.string(),
  authId: z.string(),
  dateOfBirth: z.string(),
  isRoot: z.boolean(),
  isEventOrganizer: z.boolean(),
  notificationToken: z.string().optional().nullable(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type NestUser = z.infer<typeof NestUser>;

export const useNestUser = (userId?: string) => {
  const authUser = firebaseAuth.currentUser;

  const userQuery = useQuery({
    queryKey: ["user", userId ?? authUser?.uid],
    queryFn: async () => {
      const apiUrl = `http://148.225.50.130:3000/users/find-by-auth-id/${
        userId ?? authUser?.uid
      }`;

      const res = await fetch(apiUrl, {
        headers: { Authorization: `Bearer ${await authUser?.getIdToken()}` },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        } else {
          throw new Error("Failed to fetch user data");
        }
      }

      const userParse = NestUser.safeParse(await res.json());

      if (userParse.success) {
        return userParse.data;
      } else {
        console.error(userParse);

        throw new Error("Failed to parse user data");
      }
    },
    refetchInterval: 20000,
    retryDelay: 5000,
  });

  return userQuery;
};
