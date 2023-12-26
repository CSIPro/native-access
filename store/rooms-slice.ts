import { StateCreator } from "zustand";
import { Room } from "../hooks/use-rooms";
import { getFromStorage, saveToStorage } from "../lib/utils";
import { UserSlice } from "./user-slice";

export interface RoomsSlice {
  rooms: {
    selectedRoom?: string;
    rooms: Room[];
    userRooms: Room[];
    setRooms: (rooms: Room[]) => void;
    setUserRooms: (userRooms: Room[]) => Promise<void>;
    setSelectedRoom: (roomId: string) => void;
  };
}

export const createRoomsSlice: StateCreator<
  RoomsSlice & UserSlice,
  [],
  [],
  RoomsSlice
> = (set, get) => {
  return {
    rooms: {
      rooms: [],
      userRooms: [],
      selectedRoom: undefined,
      setSelectedRoom: async (roomId) => {
        console.log(get().user);

        const canSelectRoom =
          get().user.user?.isRoot ||
          get().rooms.userRooms.some((room) => room.id === roomId);

        if (!canSelectRoom) {
          console.log("Room not found in user rooms");
        }

        set((state) => ({
          rooms: {
            ...state.rooms,
            selectedRoom: roomId,
          },
        }));
        await saveToStorage("SELECTED_ROOM", roomId);
      },
      setRooms: (rooms) => {
        set((state) => ({
          rooms: {
            ...state.rooms,
            rooms,
          },
        }));
      },
      setUserRooms: async (userRooms) => {
        try {
          if (!get().rooms.selectedRoom) {
            const savedSelectedRoom = await getFromStorage("SELECTED_ROOM");
            set((state) => ({
              rooms: {
                ...state.rooms,
                selectedRoom: savedSelectedRoom,
              },
            }));
          }

          set((state) => ({
            rooms: {
              ...state.rooms,
              userRooms,
            },
          }));
        } catch (error) {
          console.error(error);

          set((state) => ({
            rooms: {
              ...state.rooms,
              userRooms,
              selectedRoom: userRooms[0]?.id,
            },
          }));
        }
      },
    },
  };
};
