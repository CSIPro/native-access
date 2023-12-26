import { StyleSheet, Text, View, useColorScheme } from "react-native";
import { IonIcon } from "../../icons/ion";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { Log } from "../../../hooks/use-logs";
import { ComponentProps, FC } from "react";

interface Props {
  logs: Log[];
  title: string;
  color: keyof typeof colors.default;
  icon: ComponentProps<typeof IonIcon>["name"];
}

export const DashboardItem: FC<Props> = ({ logs, title, icon, color }) => {
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  const iconColor = isLight
    ? colors.default[color].translucid[600]
    : colors.default[color].translucid[600];

  return (
    <View
      style={[
        styles.dataContainer,
        {
          backgroundColor: isLight
            ? !!color
              ? colors.default[color].translucid[500]
              : colors.default.white[100]
            : !!color
            ? colors.default[color].translucid[100]
            : colors.default.black[300],
          borderWidth: 2,
          borderColor: colors.default[color][400],
        },
      ]}
    >
      <View
        style={[
          {
            ...StyleSheet.absoluteFillObject,
            top: 12,
            left: 24,
            alignItems: "center",
            justifyContent: "center",
          },
        ]}
      >
        <IonIcon name={icon} color={iconColor} size={96} />
      </View>
      <View style={[styles.dataTextContainer]}>
        <Text
          style={[
            styles.bubbleText,
            {
              fontSize: 40,
              color: isLight
                ? colors.default.white[100]
                : colors.default.white[100],
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
                ? colors.default.white[100]
                : colors.default.white.translucid[900],
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
    justifyContent: "center",
    alignItems: "center",
    width: 100,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    overflow: "hidden",
    aspectRatio: 1,
  },
  dataTextContainer: {
    alignItems: "center",
    gap: -20,
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
