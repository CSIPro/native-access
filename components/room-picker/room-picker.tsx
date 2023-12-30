import { FC, useEffect, useRef, useState } from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import { BottomSheetModal, BottomSheetFlatList } from "@gorhom/bottom-sheet";

import { BSMFooter, BSMBody, BSModal, BSMHeader } from "../ui/bottom-sheet";

import { IonIcon } from "../icons/ion";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Room } from "@/hooks/use-rooms";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useUserContext } from "@/context/user-context";
import { useRoomContext } from "@/context/room-context";

export const RoomPicker = () => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const isLight = useColorScheme() === "light";

  const { status: userStatus, user } = useUserContext();
  const { status, selectedRoom, setSelectedRoom, rooms, userRooms } =
    useRoomContext();
  const [localValue, setLocalValue] = useState<string>(selectedRoom);

  useEffect(() => {
    setLocalValue(selectedRoom);
  }, [selectedRoom]);

  if (status === "loading" || userStatus === "loading") {
    return null;
  }

  if (status === "error" || userStatus === "error") {
    return null;
  }

  const handleSubmit = () => {
    setSelectedRoom(localValue);
    sheetRef.current?.dismiss();
  };

  const submitBg = isLight
    ? colors.default.tint.translucid[100]
    : colors.default.tint.translucid[200];

  const submitText = isLight
    ? colors.default.tint[400]
    : colors.default.tint[100];

  const items = user.isRoot ? rooms : userRooms;

  const currentRoom = items.find((item) => item.id === selectedRoom);

  const displayValue = `${currentRoom?.name} (${currentRoom?.building}-${currentRoom?.room})`;

  return (
    <>
      <View
        style={[
          styles.wrapper,
          {
            borderColor: colors.default.tint[400],
            backgroundColor: isLight ? "transparent" : colors.default.tint[400],
          },
        ]}
      >
        <Pressable
          onPress={() => sheetRef.current?.present()}
          style={[styles.dropdown]}
        >
          <Text
            numberOfLines={1}
            style={[
              styles.text,
              {
                fontFamily: fonts.poppinsMedium,
                color: isLight
                  ? colors.default.tint[400]
                  : colors.default.white[100],
              },
            ]}
          >
            {displayValue}
          </Text>
          <IonIcon
            name="chevron-down"
            color={
              isLight ? colors.default.tint[400] : colors.default.white[100]
            }
            size={16}
          />
        </Pressable>
        <BSModal ref={sheetRef} snapPoints={["32%"]}>
          <BSMHeader>Pick a room</BSMHeader>
          <View style={{ flex: 1, padding: 4 }}>
            <Picker
              items={items}
              localValue={localValue}
              onChange={setLocalValue}
            />
          </View>
          <BSMFooter>
            <Pressable
              onPress={handleSubmit}
              style={[styles.textButton, { backgroundColor: submitBg }]}
            >
              <Text
                style={[styles.text, styles.mediumText, { color: submitText }]}
              >
                OK
              </Text>
            </Pressable>
          </BSMFooter>
        </BSModal>
      </View>
    </>
  );
};

interface PickerProps {
  localValue: string;
  onChange: (value: string) => void;
  items: Room[];
}

const Picker: FC<PickerProps> = ({ localValue, items, onChange }) => {
  const isLight = useColorScheme() === "light";

  return (
    <BottomSheetFlatList
      data={items}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <PickerItem
          item={item}
          selected={item.id === localValue}
          onPress={() => onChange(item.id)}
        />
      )}
      contentContainerStyle={[styles.list]}
    />
  );
};

interface PickerItemProps {
  item: Room;
  selected?: boolean;
  onPress: () => void;
}

const PickerItem: FC<PickerItemProps> = ({
  item,
  selected = false,
  onPress,
}) => {
  const progress = useDerivedValue(
    () => (selected ? withTiming(1) : withTiming(0)),
    [selected]
  );

  const isLight = useColorScheme() === "light";

  const viewStyles = useAnimatedStyle(() => {
    const backgroundColor = interpolateColor(
      progress.value,
      [0, 1],
      ["transparent", colors.default.tint.translucid[100]]
    );

    return { backgroundColor };
  });

  const textStyles = useAnimatedStyle(() => {
    const textColor = interpolateColor(
      progress.value,
      [0, 1],
      [
        isLight ? colors.default.black[400] : colors.default.white[200],
        isLight ? colors.default.tint[400] : colors.default.tint[100],
      ]
    );

    return { color: textColor };
  });

  return (
    <Pressable onPress={onPress}>
      <Animated.View style={[styles.dropdownItem, viewStyles]}>
        <Animated.Text
          numberOfLines={1}
          style={[styles.text, styles.mediumText, textStyles]}
        >{`${item.name} (${item.building}-${item.room})`}</Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    borderWidth: 2,
    borderRadius: 12,
  },
  dropdown: {
    width: "100%",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.24)",
  },
  modal: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: "80%",
    borderRadius: 8,
    backgroundColor: "#fff",
  },
  modalHeader: {
    padding: 8,
    width: "100%",
    borderBottomColor: "#e1e1e1",
    borderBottomWidth: 1,
  },
  modalBody: {
    padding: 8,
    gap: 8,
    width: "100%",
  },
  list: {
    gap: 8,
  },
  dropdownItem: {
    width: "100%",
    borderRadius: 8,
    padding: 4,
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  mediumText: {
    fontFamily: fonts.poppinsMedium,
  },
  textButton: {
    padding: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
