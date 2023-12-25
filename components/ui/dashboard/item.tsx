import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { IonIcon } from "../../icons/ion";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { Log } from "../../../hooks/use-logs";
import { ComponentProps, FC } from "react";

interface Props {
  logs: Log[];
  title: string;
  primaryColor: string;
  color?: "tint" | "secondary" | "bluetooth" | "tintAccent" | "success";
  icon: ComponentProps<typeof IonIcon>["name"];
}

export const DashboardItem: FC<Props> = ({
  logs,
  title,
  primaryColor,
  icon,
  color,
}) => {
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const iconColor = isLight
    ? !!color
      ? colors.default[color][500]
      : primaryColor
    : !!color
    ? colors.default[color][200]
    : primaryColor;

  return (
    // <View style={[styles.dataContainerShadow]}>
    <View
      style={[
        styles.dataContainer,
        {
          backgroundColor: isLight
            ? !!color
              ? colors.default[color].translucid[200]
              : colors.default.white[100]
            : !!color
            ? colors.default[color].translucid[100]
            : colors.default.black[300],
        },
        !!color && {
          borderWidth: 2,
          borderColor: isLight
            ? !!color
              ? colors.default[color][400]
              : colors.default.white[300]
            : !!color
            ? colors.default[color][400]
            : colors.default.black[400],
        },
      ]}
    >
      {!!!color && (
        <View
          style={[
            styles.dataContainerHighlight,
            { backgroundColor: primaryColor },
          ]}
        />
      )}
      <IonIcon name={icon} color={iconColor} size={24} />
      <View style={[styles.dataTextContainer]}>
        <Text
          style={[
            styles.bubbleText,
            {
              fontSize: 28,
              color: isLight
                ? !!color
                  ? colors.default[color][500]
                  : colors.default.black[400]
                : !!color
                ? colors.default[color][200]
                : colors.default.white[200],
            },
          ]}
        >
          {logs.length}
        </Text>
        <Text
          style={[
            styles.bubbleText,
            {
              color: isLight
                ? !!color
                  ? colors.default[color][300]
                  : colors.default.gray[600]
                : !!color
                ? colors.default[color][200]
                : colors.default.white[600],
            },
          ]}
        >
          {title}
        </Text>
      </View>
    </View>
    // </View>
  );
};

const styles = StyleSheet.create({
  dashboardTitle: {
    fontFamily: fonts.poppins,
    color: "#222222",
    fontSize: 24,
  },
  logsBubble: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 12,
    height: 200,
    width: 200,
  },
  successContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
    gap: -28,
    borderWidth: 2,
    borderColor: "#e5e5e5",
  },
  successShadow: {
    backgroundColor: "transparent",
    borderRadius: 100,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 3,
  },
  dashboardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
  },
  dataContainerShadow: {
    backgroundColor: "transparent",
    borderRadius: 8,
    shadowColor: "#222222",
    shadowOpacity: 0.16,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    elevation: 2,
  },
  dataContainer: {
    position: "relative",
    alignItems: "center",
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
  },
  dataTextContainer: {
    alignItems: "center",
    gap: -12,
  },
  dataContainerHighlight: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 8,
  },
  bubbleText: {
    fontFamily: fonts.poppinsMedium,
    fontSize: 14,
  },
});
