import { collection, doc } from "firebase/firestore";
import { z } from "zod";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";

const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  room: z.string(),
  building: z.string(),
});

export type Room = z.infer<typeof roomSchema>;

export const useRooms = () => {
  const firestore = useFirestore();
  const roomsCol = collection(firestore, "rooms");
  const { status: roomsStatus, data: roomsData } = useFirestoreCollectionData(
    roomsCol,
    {
      idField: "id",
    }
  );

  if (roomsStatus === "error") {
    return { status: "error", data: [] };
  }

  return {
    status: roomsStatus,
    data: roomsData as z.infer<typeof roomSchema>[],
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
    data: roomData as z.infer<typeof roomSchema>,
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
