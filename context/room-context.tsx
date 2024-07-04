import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";
import { z } from "zod";

import {
  NestRoom,
  useNestRooms,
  useRooms,
  useUserRooms,
} from "../hooks/use-rooms";
import { getFromStorage, saveToStorage } from "../lib/utils";
import { useStore } from "@/store/store";
import { SplashScreen } from "@/components/splash/splash";

const roomSchema = z.object({
  id: z.string(),
  name: z.string(),
  building: z.string(),
  room: z.string(),
});

interface RoomContextProps {
  selectedRoom?: string;
  setSelectedRoom?: (roomId: string) => void;
  rooms?: NestRoom[];
  // userRooms?: NestRoom[];
}

export const RoomContext = createContext<RoomContextProps>({});

export const RoomProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const {
    status: roomsStatus,
    data: roomsData,
    error: roomsError,
  } = useNestRooms();
  // const { status: userRoomsStatus, data: userRoomsData } = useUserRooms();
  const setBleRoom = useStore((state) => state.setSelectedRoom);

  useEffect(() => {
    const retrieveSelectedRoom = async () => {
      const roomId = await getFromStorage("SELECTED_ROOM");

      if (!roomId) {
        setSelectedRoom(roomsData?.at(0)?.id);
        return;
      }

      setSelectedRoom(roomId);
    };

    if (selectedRoom) {
      saveToStorage("SELECTED_ROOM", selectedRoom);

      const roomData = roomsData.find((room) => room.id === selectedRoom);
      if (roomData) {
        setBleRoom(roomData.name);
      }
    } else if (roomsData) {
      retrieveSelectedRoom();
    }
  }, [selectedRoom, roomsData]);

  if (roomsStatus === "loading") {
    return <SplashScreen loading message="Loading rooms..." />;
  }

  if (roomsStatus === "error") {
    return <SplashScreen message="Unable to connect to the server" />;
  }

  // const rooms = [...roomsData]?.filter((room) =>
  //   userRoomsData.some((userRoom) => userRoom.id === room.id)
  // );

  const providerValue = {
    selectedRoom: selectedRoom || roomsData.at(0).id,
    setSelectedRoom,
    rooms: [...roomsData],
    // userRooms: [...rooms],
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
