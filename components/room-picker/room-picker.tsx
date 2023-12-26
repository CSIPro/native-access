import { useColorScheme } from "react-native";

import { Dropdown } from "../ui/dropdown";

import { useRoomContext } from "../../context/room-context";
import { useUserContext } from "../../context/user-context";

export const RoomPicker = () => {
  const { status: userStatus, user } = useUserContext();
  const { status, selectedRoom, setSelectedRoom, rooms, userRooms } =
    useRoomContext();

  if (status === "loading" || userStatus === "loading") {
    return null;
  }

  if (status === "error" || userStatus === "error") {
    return null;
  }

  const items = user.isRoot ? rooms : userRooms;

  return (
    <Dropdown
      items={items?.map((room) => ({
        value: room.id,
        label: `${room.name} (${room.building}-${room.room})`,
      }))}
      value={selectedRoom}
      onChange={setSelectedRoom}
    />
  );
};
