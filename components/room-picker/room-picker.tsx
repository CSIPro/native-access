import { FC } from "react";
import {
  ActivityIndicator,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import { BottomSheetFlatList } from "@gorhom/bottom-sheet";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { Room } from "@/hooks/use-rooms";
import Animated, {
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { useRoomContext } from "@/context/room-context";
import { Dropdown } from "../ui/dropdown";
import { formatRoomName } from "@/lib/utils";
import { MaterialIcon } from "../icons/material";
import { useMemberships } from "@/hooks/use-membership";
import { useUserContext } from "@/context/user-context";

interface Props {
  compact?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  chevronColor?: string;
  disabled?: boolean;
}

export const RoomPicker: FC<Props> = ({
  compact = false,
  disabled = false,
  textStyle,
  style,
  chevronColor,
}) => {
  const isLight = useColorScheme() === "light";

  const { user } = useUserContext();
  const { selectedRoom, setSelectedRoom, rooms } = useRoomContext();
  const { status: membershipsStatusF, data: memberships } = useMemberships(
    user.id
  );

  if (membershipsStatusF === "loading") {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={colors.default.tint[400]} />
      </View>
    );
  }

  if (membershipsStatusF === "error") {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.text, { color: colors.default.black[400] }]}>
          Error while fetching memberships
        </Text>
      </View>
    );
  }

  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  const items = user.isRoot
    ? rooms
    : rooms.filter((room) => memberships.some((m) => m.room.id === room.id));

  return (
    <Dropdown
      items={items.map((i) => ({
        key: i.id,
        value: i.id,
        label: compact ? i.name : formatRoomName(i),
      }))}
      onChange={setSelectedRoom}
      compact={compact}
      disabled={disabled}
      sheetTitle="Pick a room"
      value={selectedRoom}
      icon={
        compact ? null : (
          <MaterialIcon name="room" size={24} color={iconColor} />
        )
      }
      style={[{ borderRadius: 12, borderColor: iconColor }, style]}
      valueStyle={[{ fontFamily: fonts.interMedium }, textStyle]}
      ListEmptyComponent={
        <View
          style={[{ flex: 1, justifyContent: "center", alignItems: "center" }]}
        >
          <Text style={[styles.text, { textAlign: "center", color }]}>
            Aún no eres miembro de ningún salón
          </Text>
        </View>
      }
      chevronColor={chevronColor}
    />
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
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
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
