import { useFirestore, useFirestoreCollectionData } from "reactfire";
import { useRoomContext } from "../context/room-context";
import {
  Timestamp,
  collection,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { z } from "zod";

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
