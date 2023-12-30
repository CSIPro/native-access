import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import { DatePicker } from "@/components/ui/date-picker";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useRooms } from "@/hooks/use-rooms";
import { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { useRef, useState } from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TextInput,
  View,
  useColorScheme,
} from "react-native";

export default function SignUp() {
  const { status: roomsStatus, data: rooms } = useRooms();
  const [selectedRoom, setSelectedRoom] = useState<string>(rooms?.at(0)?.id);
  const [birthday, setBirthday] = useState(new Date());
  const nameRef = useRef<TextInput>(null);
  const uniSonIdRef = useRef<TextInput>(null);
  const passcodeRef = useRef<TextInput>(null);

  const isLight = useColorScheme() === "light";

  const handleBirthdayChange = (_: DateTimePickerEvent, date: Date) => {
    setBirthday(date);
  };

  const backgroundColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  const color = isLight ? colors.default.black[400] : colors.default.white[100];

  const iconColor = isLight
    ? colors.default.tint[400]
    : colors.default.tint[200];

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor }}>
      <Stack.Screen
        options={{
          headerTitle: "Sign up",
          headerTitleStyle: {
            fontFamily: fonts.poppinsMedium,
            color: colors.default.white[100],
          },
          headerStyle: {
            backgroundColor: colors.default.tint[400],
          },
          headerTintColor: colors.default.white[100],
        }}
      />
      <View style={[{ padding: 4, gap: 4 }]}>
        <Input
          ref={nameRef}
          label="Name"
          placeholder="e.g. Saúl Ramos"
          icon={<IonIcon name="person" size={24} color={iconColor} />}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            uniSonIdRef.current?.focus();
          }}
          autoCapitalize="words"
        />
        <Input
          ref={uniSonIdRef}
          label="UniSon ID"
          placeholder="e.g. 217200160"
          icon={<MaterialIcon name="badge" size={24} color={iconColor} />}
          returnKeyType="next"
          blurOnSubmit={false}
          onSubmitEditing={() => {
            passcodeRef.current?.focus();
          }}
          inputMode="numeric"
        />
        <Input
          ref={passcodeRef}
          label="Passcode"
          placeholder="e.g. 123A"
          icon={
            <IonIcon
              name="md-code-working-outline"
              size={24}
              color={iconColor}
            />
          }
          secureTextEntry={true}
          autoCapitalize="characters"
        />
        <DatePicker
          label="Birthday"
          value={birthday}
          onChange={handleBirthdayChange}
        />
        {roomsStatus === "loading" && (
          <View style={[styles.wrapper]}>
            <View style={[styles.labelWrapper]}>
              <Text style={[styles.text, { color }]}>Room</Text>
            </View>
            <View style={[styles.inputWrapper]}>
              <ActivityIndicator size="small" color={iconColor} />
            </View>
          </View>
        )}
        {roomsStatus === "success" && (
          <Dropdown
            items={rooms.map((room) => ({
              key: room.id,
              value: room.id,
              label: `${room.name} (${room.building}-${room.room})`,
            }))}
            onChange={setSelectedRoom}
            sheetTitle="Pick a room"
            label="Room"
            value={selectedRoom}
          />
        )}
      </View>
      <StatusBar style="light" />
    </View>
  );
}

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
    justifyContent: "center",
    alignItems: "center",
    gap: 8,
  },
  labelWrapper: {
    paddingHorizontal: 8,
  },
  text: {
    paddingTop: 4,
    fontFamily: fonts.poppins,
    fontSize: 16,
  },
});
