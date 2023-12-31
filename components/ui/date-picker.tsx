import { format } from "date-fns/esm";

import { FC, useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";

import DateTimePicker, {
  AndroidNativeProps,
  DateTimePickerAndroid,
  DateTimePickerEvent,
} from "@react-native-community/datetimepicker";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

import { IonIcon } from "../icons/ion";

interface Props extends Omit<AndroidNativeProps, "onChange"> {
  label?: string;
  onChange: (date: Date) => void;
}

export const DatePicker: FC<Props> = ({
  label = "Date",
  value,
  onChange,
  ...props
}) => {
  const [show, setShow] = useState(false);

  const isLight = useColorScheme() === "light";

  const maximumDate = new Date();
  const minimumDate = new Date(maximumDate.getFullYear() - 100, 0, 1);

  const handleChange = (e: DateTimePickerEvent, selectedDate?: Date) => {
    if (!selectedDate) return;
    onChange(selectedDate);
    setShow(false);
  };

  const showDatePicker = () => {
    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value,
        onChange: handleChange,
        minimumDate,
        maximumDate,
        ...props,
      });
    }

    setShow(true);
  };

  const backgroundColor = isLight
    ? colors.default.gray.translucid[100]
    : colors.default.gray.translucid[50];

  const color = isLight ? colors.default.black[400] : colors.default.white[100];

  const borderColor = isLight
    ? colors.default.tint.translucid[500]
    : colors.default.tint.translucid[600];

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <Pressable onPress={showDatePicker} style={[styles.wrapper]}>
      <View style={[styles.labelWrapper]}>
        <Text style={[styles.text, { color }]}>{label}</Text>
      </View>
      <View style={[styles.inputWrapper, { backgroundColor, borderColor }]}>
        <View style={[styles.iconWrapper]}>
          <IonIcon name="calendar" size={24} color={iconColor} />
        </View>
        <Text style={[styles.text, { color }]}>{format(value, "PPP")}</Text>
        {Platform.OS !== "android" && show && (
          <DateTimePicker
            value={value}
            onChange={handleChange}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            {...props}
          />
        )}
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    width: "100%",
    gap: -4,
  },
  inputWrapper: {
    padding: 8,
    borderWidth: 2,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  iconWrapper: {
    width: 24,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  labelWrapper: {
    paddingHorizontal: 8,
  },
  input: {
    width: "100%",
  },
  text: {
    fontFamily: fonts.poppins,
    fontSize: 16,
    paddingTop: 4,
  },
});
