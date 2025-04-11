import { SafeAreaView } from "react-native-safe-area-context";

import colors from "@/constants/colors";
import { Tabs, TabSlot, TabList, TabTrigger } from "expo-router/ui";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import { BlurView } from "expo-blur";
import { StyleSheet, Text, useColorScheme, View } from "react-native";
import { TabButton } from "@/components/member-tabs/tab-button";

export default function MembersLayout() {
  const isLight = useColorScheme() === "light";
  const tabsHeight = useBottomTabBarHeight();

  return (
    <Tabs>
      <TabList
        style={{
          position: "absolute",
          bottom: tabsHeight + 8,
          height: 50,
          backgroundColor: colors.default.black.translucid[800],
          borderRadius: 8,
          borderWidth: 2,
          borderColor: colors.default.tint[100],
          left: 4,
          right: 4,
          justifyContent: "space-evenly",
          zIndex: 999,
          overflow: "hidden",
        }}
        asChild
      >
        <BlurView
          intensity={32}
          tint={isLight ? "light" : "dark"}
          style={[
            {
              ...StyleSheet.absoluteFillObject,
              overflow: "hidden",
              backgroundColor: isLight
                ? colors.default.white.translucid[600]
                : colors.default.black.translucid[800],
              borderColor: colors.default.tint[400],
              borderWidth: 2,
              borderRadius: 14,
            },
          ]}
        >
          <TabTrigger name="members" href="members" asChild>
            <TabButton>Miembros</TabButton>
          </TabTrigger>
          <TabTrigger name="restrictions" href="members/restrictions" asChild>
            <TabButton>Restricciones</TabButton>
          </TabTrigger>
          <TabTrigger name="requests" href="members/requests" asChild>
            <TabButton>Solicitudes</TabButton>
          </TabTrigger>
        </BlurView>
      </TabList>
      <SafeAreaView
        style={{ flex: 1, backgroundColor: colors.default.tint[400] }}
      >
        <TabSlot />
      </SafeAreaView>
    </Tabs>
  );
}
