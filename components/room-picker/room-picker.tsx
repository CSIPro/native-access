import { useColorScheme } from "react-native";

import { Dropdown } from "../ui/dropdown";

import { useRoomContext } from "../../context/room-context";
import {
  useStoreRooms,
  useSelectedRoom,
  useSetSelectedRoom,
} from "../../store/store";

export const RoomPicker = () => {
  const rooms = useStoreRooms();
  const selectedRoom = useSelectedRoom();
  const setSelectedRoom = useSetSelectedRoom();

  return (
    <Dropdown
      items={
        rooms?.map((room) => ({
          value: room.id,
          label: `${room.name} (${room.building}-${room.room})`,
        })) ?? []
      }
      value={selectedRoom}
      onChange={setSelectedRoom}
    />
  );
};
