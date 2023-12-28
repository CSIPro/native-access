import * as LocalAuthentication from "expo-local-authentication";
import {
  Timestamp,
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

enum RequestStatus {
  pending,
  approved,
  rejected,
}

export const RequestStatusEnum = z.nativeEnum(RequestStatus);
export type RequestStatusEnum = z.infer<typeof RequestStatusEnum>;

export const requestSchema = z.object({
  id: z.string(),
  status: RequestStatusEnum,
  userId: z.string(),
  roomId: z.string(),
  adminId: z.string().optional(),
  userComment: z.string().optional(),
  adminComment: z.string().optional(),
  createdAt: z.custom<Timestamp>(),
  updatedAt: z.custom<Timestamp>(),
});
export type Request = z.infer<typeof requestSchema>;

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

  return {
    status,
    data: data as Request[],
  };
};

export const useRequestHelpers = (request: Request) => {
  const user = useUser();
  const firestore = useFirestore();
  const { data: roles } = useRoles();
  const requestDoc = doc(firestore, "requests", request.id);

  const approveRequest = async () => {
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
  };

  const rejectRequest = async () => {
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
  };

  return {
    approveRequest,
    rejectRequest,
  };
};
