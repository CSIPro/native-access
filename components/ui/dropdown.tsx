import { FC, ReactNode, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";
import Animated, {
  interpolate,
  interpolateColor,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated";
import { z } from "zod";

import { BottomSheetFlatList, BottomSheetModal } from "@gorhom/bottom-sheet";

import { Modal, ModalBody, ModalFooter, ModalHeader } from "../modal/modal";
import { BSMHeader, BSModal } from "./bottom-sheet";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { IonIcon } from "../icons/ion";
import { MaterialIcon } from "../icons/material";
import { BottomSheetFlatListProps } from "@gorhom/bottom-sheet/lib/typescript/components/bottomSheetScrollable/types";

export const DropdownItemType = z.object({
  label: z.string(),
  value: z.string(),
  key: z.string().optional(),
});

export type DropdownItemType = z.infer<typeof DropdownItemType>;

interface Props {
  compact?: boolean;
  items?: DropdownItemType[];
  value: string;
  label?: string;
  onChange: (value: string) => void;
  sheetTitle: string;
  placeholder?: string;
  ListEmptyComponent?: BottomSheetFlatListProps<DropdownItemType>["ListEmptyComponent"];
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
  valueStyle?: StyleProp<TextStyle>;
}

export const Dropdown: FC<Props> = ({
  compact = false,
  sheetTitle,
  items = [],
  placeholder = "Pick one",
  value,
  label,
  onChange,
  icon: Icon,
  style,
  valueStyle,
  ListEmptyComponent,
}) => {
  const sheetRef = useRef<BottomSheetModal>(null);
  const [selectedRoom, setSelectedRoom] = useState(value);
  const isLight = useColorScheme() === "light";

  useEffect(() => {
    setSelectedRoom(value);
  }, [value]);

  const handleDone = () => {
    onChange(selectedRoom);
    sheetRef.current?.dismiss();
  };

  const color = isLight ? colors.default.black[400] : colors.default.white[100];
  const backgroundColor = isLight
    ? colors.default.gray.translucid[100]
    : colors.default.gray.translucid[50];
  const borderColor = isLight
    ? colors.default.tint.translucid[500]
    : colors.default.tint.translucid[600];

  return (
    <View style={[styles.wrapper]}>
      {!!label && (
        <View style={[styles.labelWrapper]}>
          <Text style={[styles.text, { color }]}>{label}</Text>
        </View>
      )}
      <Pressable
        onPress={() => sheetRef.current?.present()}
        style={[
          styles.dropdown,
          {
            borderColor,
            backgroundColor,
          },
          style,
        ]}
      >
        {!!Icon && <View style={[styles.iconWrapper]}>{Icon}</View>}
        <Text
          numberOfLines={1}
          style={[styles.dropdownLabel, { color }, valueStyle]}
        >
          {items.find((item) => item.value === value)?.label ?? placeholder}
        </Text>
        <View style={[styles.iconWrapper, compact && { width: 10 }]}>
          <IonIcon
            name="chevron-down"
            color={
              isLight ? colors.default.tint[400] : colors.default.white[100]
            }
            size={compact ? 10 : 24}
          />
        </View>
      </Pressable>

      <BSModal ref={sheetRef} snapPoints={["32%", "40%"]}>
        <BSMHeader action={handleDone}>{sheetTitle}</BSMHeader>
        <BottomSheetFlatList
          data={items}
          keyExtractor={(item) => item.key ?? item.value}
          renderItem={({ item }) => (
            <DropdownItem
              item={item}
              selectedRoom={selectedRoom}
              setSelectedRoom={setSelectedRoom}
            />
          )}
          contentContainerStyle={[styles.list]}
          ListEmptyComponent={ListEmptyComponent}
        />
      </BSModal>
    </View>
  );
};

interface DropdownItemProps {
  item: DropdownItemType;
  selectedRoom: string;
  setSelectedRoom: (value: string) => void;
}

const DropdownItem: FC<DropdownItemProps> = ({
  item,
  selectedRoom,
  setSelectedRoom,
}) => {
  const progress = useDerivedValue(
    () => (selectedRoom === item.value ? withTiming(1) : withTiming(0)),
    [selectedRoom, item]
  );

  const colorScheme = useColorScheme();
  const isLight = colorScheme === "light";

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
    <Pressable
      onPress={() => {
        setSelectedRoom(item.value);
      }}
    >
      <Animated.View style={[styles.dropdownItem, viewStyles]}>
        <Animated.Text
          numberOfLines={1}
          style={[
            styles.dropdownLabel,
            textStyles,
            selectedRoom === item.value && { fontFamily: fonts.poppinsMedium },
          ]}
        >
          {item.label ?? "Unknown"}
        </Animated.Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: -4,
  },
  dropdown: {
    width: "100%",
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 2,
    gap: 8,
  },
  list: {
    gap: 8,
    padding: 4,
  },
  dropdownItem: {
    width: "100%",
    borderRadius: 4,
    padding: 4,
  },
  dropdownLabel: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
    flexGrow: 1,
  },
  labelWrapper: {
    paddingHorizontal: 8,
  },
  iconWrapper: {
    width: 24,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
  textButton: {
    padding: 8,
    borderRadius: 8,
  },
});
