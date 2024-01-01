import { collection, doc } from "firebase/firestore";
import { z } from "zod";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { useCallback } from "react";

export const Room = z.object({
  id: z.string(),
  name: z.string(),
  room: z.string(),
  building: z.string(),
});

export type Room = z.infer<typeof Room>;

export const useRooms = () => {
  const firestore = useFirestore();
  const roomsCol = collection(firestore, "rooms");
  const { status: roomsStatus, data: roomsData } = useFirestoreCollectionData(
    roomsCol,
    {
      idField: "id",
    }
  );

  const rooms = useCallback(
    () =>
      roomsData?.map((room) => {
        const roomSafeParse = Room.safeParse(room);

        if (roomSafeParse.success) {
          return roomSafeParse.data;
        }
      }),
    [roomsData]
  )();

  return {
    status: roomsStatus,
    data: rooms,
  };
};

export const useRoom = (roomId: string) => {
  const firestore = useFirestore();
  const roomDoc = doc(firestore, "rooms", roomId);
  const { status: roomStatus, data: roomData } = useFirestoreDocData(roomDoc, {
    idField: "id",
  });

  if (roomStatus === "error") {
    return { status: "error" };
  }

  return {
    status: roomStatus,
    data: roomData as z.infer<typeof Room>,
  };
};

export const userRoomSchema = z.object({
  id: z.string(),
  accessGranted: z.boolean(),
  key: z.string(),
  roleId: z.string(),
});

export const useUserRooms = () => {
  const user = useUser();
  const firestore = useFirestore();
  const userRoomsCol = collection(
    firestore,
    "user_roles",
    user.data?.uid || "invalid",
    "room_roles"
  );
  const { status: userRoomsStatus, data: userRoomsData } =
    useFirestoreCollectionData(userRoomsCol, {
      idField: "id",
    });

  if (userRoomsStatus === "error") {
    return { status: "error" };
  }

  return {
    status: userRoomsStatus,
    data: userRoomsData as z.infer<typeof userRoomSchema>[],
  };
};
