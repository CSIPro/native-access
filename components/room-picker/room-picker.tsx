import SelectDropdown from "react-native-select-dropdown";

import { useRoomContext } from "../../context/room-context";
import { StyleSheet, useColorScheme } from "react-native";
import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import { Dropdown } from "../ui/dropdown";

export const RoomPicker = () => {
  const colorScheme = useColorScheme();
  const { status, selectedRoom, setSelectedRoom, rooms, userRooms } =
    useRoomContext();

  const palette = colors[colorScheme];

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
    // <SelectDropdown
    //   onSelect={(itemValue) => setSelectedRoom(itemValue)}
    //   data={
    //     rooms?.map((room) => ({
    //       label: `${room.name} (${room.building}-${room.room})`,
    //       value: room.id,
    //       key: room.id,
    //     })) ?? []
    //   }
    //   style={{
    //     inputAndroid: {
    //       fontFamily: fonts.poppinsBold,
    //       fontSize: 16,
    //       color: "#fff",
    //       borderWidth: 1,
    //       width: "100%",
    //       backgroundColor: palette.tint,
    //       borderRadius: 8,
    //       padding: 8,
    //       marginVertical: 8,
    //     },
    //   }}
    //   // style={[styles.picker, { backgroundColor: palette.tint }]}
    //   // itemStyle={styles.pickerItem}
    // />
  );
};

const styles = StyleSheet.create({
  picker: {
    borderWidth: 1,
    width: "100%",
    fontFamily: fonts.poppinsBold,
    fontSize: 16,
    color: "#fff",
  },
  pickerItem: {
    fontFamily: fonts.poppinsRegular,
    fontSize: 16,
    color: "#fff",
  },
});
