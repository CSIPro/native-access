import { withLayoutContext } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  createMaterialTopTabNavigator,
  MaterialTopTabNavigationOptions,
  MaterialTopTabNavigationEventMap,
} from "@react-navigation/material-top-tabs";
import { ParamListBase, TabNavigationState } from "@react-navigation/native";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

const { Navigator } = createMaterialTopTabNavigator();

const MaterialTopTabs = withLayoutContext<
  MaterialTopTabNavigationOptions,
  typeof Navigator,
  TabNavigationState<ParamListBase>,
  MaterialTopTabNavigationEventMap
>(Navigator);

export default function MembersLayout() {
  const tabStyle = {
    tabBarStyle: {
      backgroundColor: colors.default.tint[400],
    },
    tabBarLabelStyle: {
      fontFamily: fonts.poppinsMedium,
      textTransform: "capitalize",
      fontSize: 16,
    },
    tabBarActiveTintColor: colors.default.white[100],
    tabBarIndicatorStyle: {
      backgroundColor: colors.default.white[100],
    },
  } as const;

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.default.tint[400] }]}
    >
      <MaterialTopTabs>
        <MaterialTopTabs.Screen
          name="index"
          options={{
            title: "Miembros",
            lazy: true,
            ...tabStyle,
          }}
        />
        <MaterialTopTabs.Screen
          name="requests"
          options={{ title: "Solicitudes", lazy: true, ...tabStyle }}
        />
      </MaterialTopTabs>
    </SafeAreaView>
  );
}
