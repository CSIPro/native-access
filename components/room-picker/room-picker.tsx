import { useColorScheme } from "react-native";

import { Dropdown } from "../ui/dropdown";

import { useRoomContext } from "../../context/room-context";

export const RoomPicker = () => {
  const { status, selectedRoom, setSelectedRoom, rooms, userRooms } =
    useRoomContext();

  if (status === "loading") {
    return null;
  }

  if (status === "error") {
    return null;
  }

  return (
    <Dropdown
      items={rooms?.map((room) => ({
        value: room.id,
        label: `${room.name} (${room.building}-${room.room})`,
      }))}
      value={selectedRoom}
      onChange={setSelectedRoom}
    />
  );
};
