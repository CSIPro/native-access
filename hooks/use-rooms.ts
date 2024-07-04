import { collection, doc } from "firebase/firestore";
import { z } from "zod";
import {
  useFirestore,
  useFirestoreCollectionData,
  useFirestoreDocData,
  useUser,
} from "reactfire";
import { useCallback } from "react";
import { useQuery } from "react-query";
import { firebaseAuth } from "@/lib/firebase-config";
import { NestError } from "@/lib/utils";

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

export const NestRoom = z.object({
  id: z.string(),
  roomNumber: z.string().optional().nullable(),
  name: z.string(),
  building: z.string(),
  ownerId: z.string(),
  macAddress: z.string(),
  active: z.boolean(),
  oldId: z.string(),
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type NestRoom = z.infer<typeof NestRoom>;

export const useNestRooms = () => {
  const authUser = firebaseAuth.currentUser;

  const roomsQuery = useQuery({
    queryKey: ["rooms"],
    queryFn: async () => {
      const res = await fetch("http://148.225.50.130:3000/rooms", {
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching rooms");
      }

      const roomsParse = NestRoom.array().safeParse(await res.json());

      if (!roomsParse.success) {
        throw new Error("An error occurred while parsing rooms");
      }

      return roomsParse.data;
    },
  });

  return roomsQuery;
};

export const useNestRoom = (roomId: string) => {
  const roomQuery = useQuery({
    queryKey: ["room", roomId],
    queryFn: async () => {
      const res = await fetch(`http://148.225.50.130:3000/rooms/${roomId}`);

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching room data");
      }

      const roomParse = NestRoom.safeParse(await res.json());

      if (!roomParse.success) {
        throw new Error("An error occurred while parsing room data");
      }

      return roomParse.data;
    },
  });

  return roomQuery;
};
