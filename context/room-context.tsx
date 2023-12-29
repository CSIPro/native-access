import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

import { useRooms, useUserRooms } from "../hooks/use-rooms";
import { getFromStorage, saveToStorage } from "../lib/utils";

const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  building: z.string(),
  room: z.string(),
});

interface RoomContextProps {
  status?: "loading" | "error" | "success";
  selectedRoom?: string;
  setSelectedRoom?: (roomId: string) => void;
  rooms?: z.infer<typeof roomSchema>[];
  userRooms?: z.infer<typeof roomSchema>[];
}

export const RoomContext = createContext<RoomContextProps>({});

export const RoomProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const { status: roomsStatus, data: roomsData } = useRooms();
  const { status: userRoomsStatus, data: userRoomsData } = useUserRooms();

  useEffect(() => {
    const retrieveSelectedRoom = async () => {
      const roomId = await getFromStorage("SELECTED_ROOM");

      setSelectedRoom(roomId);
    };

    if (selectedRoom) {
      saveToStorage("SELECTED_ROOM", selectedRoom);
    } else if (roomsData) {
      retrieveSelectedRoom();
    }
  }, [selectedRoom, roomsData]);

  if (roomsStatus === "loading" || userRoomsStatus === "loading") {
    return (
      <RoomContext.Provider value={{ status: "loading" }}>
        {children}
      </RoomContext.Provider>
    );
  }

  if (roomsStatus === "error" || userRoomsStatus === "error") {
    return (
      <RoomContext.Provider value={{ status: "error" }}>
        {children}
      </RoomContext.Provider>
    );
  }

  if (!roomsData || !userRoomsData) {
    return (
      <RoomContext.Provider value={{ status: "error" }}>
        {children}
      </RoomContext.Provider>
    );
  }

  const rooms = [...roomsData]?.filter((room) =>
    userRoomsData.some((userRoom) => userRoom.id === room.id)
  );

  const providerValue = {
    selectedRoom: selectedRoom || rooms.at(0)?.id,
    setSelectedRoom,
    rooms: [...roomsData],
    userRooms: [...rooms],
  };

  return (
    <RoomContext.Provider value={providerValue}>
      {children}
    </RoomContext.Provider>
  );
};

export const useRoomContext = () => {
  const context = useContext(RoomContext);

  if (!context) {
    throw new Error("useRoom must be used within a RoomProvider");
  }

  return context;
};
