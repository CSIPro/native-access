import { Pressable, StyleSheet } from "react-native";
import { IonIcon } from "../icons/ion";
import colors from "@/constants/colors";
import { Link } from "expo-router";

export const AddRestriction = () => {
  return (
    <Link href="members/restrictions/create" asChild>
      <Pressable style={styles.container}>
        <IonIcon name="add-circle" size={40} color={colors.default.tint[400]} />
      </Pressable>
    </Link>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    borderRadius: 8,
    backgroundColor: colors.default.tint.translucid[100],
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
