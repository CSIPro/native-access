import * as LocalAuthentication from "expo-local-authentication";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { z } from "zod";

import { useRoles } from "./use-roles";

import { useRoomContext } from "../context/room-context";
import { useCallback } from "react";

enum RequestStatus {
  pending,
  approved,
  rejected,
}

export const RequestStatusEnum = z.nativeEnum(RequestStatus);
export type RequestStatusEnum = z.infer<typeof RequestStatusEnum>;

export const Request = z.object({
  id: z.string(),
  status: RequestStatusEnum,
  userId: z.string(),
  roomId: z.string(),
  adminId: z.string().nullable().optional(),
  userComment: z.string().nullable().optional(),
  adminComment: z.string().nullable().optional(),
  createdAt: z.custom<Timestamp>(),
  updatedAt: z.custom<Timestamp>(),
});
export type Request = z.infer<typeof Request>;

export const useRoomRequests = () => {
  const roomCtx = useRoomContext();

  const firestore = useFirestore();
  const requestsCol = collection(firestore, "requests");
  const requestsQuery = query(
    requestsCol,
    where("roomId", "==", roomCtx.selectedRoom || ""),
    orderBy("createdAt", "desc")
  );

  const { status, data } = useFirestoreCollectionData(requestsQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status };
  }

  if (status === "error") {
    return { status };
  }

  const requests = data.map((doc) => {
    const requestSafeParse = Request.safeParse(doc);
    const request = requestSafeParse.success ? requestSafeParse.data : null;

    return request;
  });

  return {
    status,
    data: requests,
  };
};

export const useUserRequests = () => {
  const firestore = useFirestore();
  const user = useUser();

  const requestsCol = collection(firestore, "requests");
  const requestsQuery = query(
    requestsCol,
    where("userId", "==", user.data?.uid || "invalid"),
    orderBy("createdAt", "desc")
  );

  const { status, data } = useFirestoreCollectionData(requestsQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status };
  }

  if (status === "error") {
    return { status };
  }

  const requests =
    data?.map((doc) => {
      const requestSafeParse = Request.safeParse(doc);
      const request = requestSafeParse.success ? requestSafeParse.data : null;

      return request;
    }) ?? [];

  return {
    status,
    data: requests,
  };
};

export const useRequestHelpers = (request?: Request) => {
  const user = useUser();
  const firestore = useFirestore();
  const { data: roles } = useRoles();
  const requestDoc = doc(firestore, "requests", request?.id ?? "invalid");

  const approveRequest = useCallback(async () => {
    if (user.data === null) return;

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to approve request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      const guestRole = roles?.find((role) => role.name === "Guest");
      if (!guestRole) {
        throw new Error("Guest role not found");
      }

      const roomRolesDoc = doc(
        firestore,
        "user_roles",
        request.userId,
        "room_roles",
        request.roomId
      );

      await updateDoc(requestDoc, {
        status: RequestStatusEnum.enum.approved,
        adminId: user.data?.uid,
        updatedAt: Timestamp.now(),
      });

      await setDoc(roomRolesDoc, {
        roleId: guestRole.id,
        accessGranted: true,
        key: request.roomId,
      });
    } catch (error) {
      console.error(error);
    }
  }, [user.data, request, roles, firestore, requestDoc]);

  const rejectRequest = useCallback(async () => {
    if (user.data === null) return;

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to reject request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      await updateDoc(requestDoc, {
        status: RequestStatusEnum.enum.rejected,
        adminId: user.data?.uid,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(error);
    }
  }, [user.data, request, firestore, requestDoc]);

  const createRequest = useCallback(
    async (roomId: string) => {
      if (user.data === null) throw new Error("User not found");

      try {
        const requestsCol = collection(firestore, "requests");
        const timestamp = Timestamp.now();

        await addDoc(requestsCol, {
          status: RequestStatusEnum.enum.pending,
          userId: user.data.uid,
          roomId,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      } catch (error) {
        console.error(error);

        throw new Error("Failed to create request, please try again later");
      }
    },
    [user.data, firestore]
  );

  return !!request
    ? ({
        approveRequest: approveRequest,
        rejectRequest: rejectRequest,
        createRequest,
      } as const)
    : ({
        createRequest,
      } as const);
};
