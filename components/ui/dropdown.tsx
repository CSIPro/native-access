import { FC, useState } from "react";
import {
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { z } from "zod";

import fonts from "../../constants/fonts";
import colors from "../../constants/colors";
import { IonIcon } from "../icons/ion";

const itemSchema = z.object({
  label: z.string(),
  value: z.string(),
  key: z.string().optional(),
});

export type DropdownItemType = z.infer<typeof itemSchema>;

interface Props {
  items: DropdownItemType[];
  value: string;
  // label: (item: DropdownItemType) => string;
  onChange: (value: string) => void;
}

export const Dropdown: FC<Props> = ({ items, value, onChange }) => {
  const [open, setOpen] = useState(false);
  const colorScheme = useColorScheme();

  const palette = colors[colorScheme];

  return (
    <View style={[styles.wrapper, { borderColor: palette.tint }]}>
      <Pressable onPress={() => setOpen(true)} style={[styles.dropdown]}>
        <Text
          numberOfLines={1}
          style={[
            styles.dropdownLabel,
            { fontFamily: fonts.poppinsMedium, color: palette.tint },
          ]}
        >
          {items.find((item) => item.value === value)?.label ?? "Select"}
        </Text>
        <IonIcon name="chevron-down" color={palette.tint} size={16} />
      </Pressable>

      <Modal
        visible={open}
        transparent={true}
        animationType="slide"
        onOrientationChange={() => setOpen(false)}
        onRequestClose={() => setOpen(false)}
      >
        <Pressable onPress={() => setOpen(false)} style={[styles.backdrop]}>
          <View />
        </Pressable>
        <View style={[styles.modal]}>
          <View style={[styles.modalContainer]}>
            <View style={[styles.modalHeader]}>
              <Text
                style={[
                  styles.dropdownLabel,
                  { fontFamily: fonts.poppinsMedium },
                ]}
              >
                Select a room
              </Text>
            </View>
            <View style={[styles.modalBody]}>
              <FlatList
                data={items}
                keyExtractor={(item) => item.key ?? item.value}
                renderItem={({ item }) => (
                  <Pressable
                    onPress={() => {
                      onChange(item.value);
                      setOpen(false);
                    }}
                    style={[
                      styles.dropdownItem,
                      value === item.value && {
                        backgroundColor: palette.tintTranslucid,
                      },
                    ]}
                  >
                    <Text
                      numberOfLines={1}
                      style={[
                        styles.dropdownLabel,
                        value === item.value && {
                          fontFamily: fonts.poppinsMedium,
                          color: palette.tint,
                        },
                      ]}
                    >
                      {item.label ?? "wat"}
                    </Text>
                  </Pressable>
                )}
                contentContainerStyle={[styles.list]}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
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
    borderRadius: 4,
    padding: 4,
  },
  dropdownLabel: {
    paddingTop: 4,
    fontFamily: fonts.poppinsRegular,
    fontSize: 16,
  },
});
