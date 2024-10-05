import {
  FC,
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useState,
} from "react";

import { NestRoom, useNestRooms } from "../hooks/use-rooms";
import { getFromStorageAsync, saveToStorageAsync } from "../lib/utils";
import { useStore } from "@/store/store";
import { SplashScreen } from "@/components/splash/splash";

interface RoomContextProps {
  selectedRoom?: string;
  setSelectedRoom?: (roomId: string) => void;
  rooms?: NestRoom[];
}

export const RoomContext = createContext<RoomContextProps>({});

export const RoomProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [selectedRoom, setSelectedRoom] = useState<string>();
  const {
    status: roomsStatus,
    data: roomsData,
    error: roomsError,
  } = useNestRooms();
  const setBleRoom = useStore((state) => state.setSelectedRoom);

  useEffect(() => {
    const retrieveSelectedRoom = async () => {
      const roomId = await getFromStorageAsync("SELECTED_ROOM");

      if (!roomId) {
        setSelectedRoom(roomsData?.at(0)?.id);
        return;
      }

      setSelectedRoom(roomId);
    };

    if (selectedRoom) {
      saveToStorageAsync("SELECTED_ROOM", selectedRoom);

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

  const providerValue = {
    selectedRoom: selectedRoom || roomsData.at(0)?.id,
    setSelectedRoom,
    rooms: [...roomsData],
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
