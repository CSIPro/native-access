import { Stack } from "expo-router";
import { View, useColorScheme } from "react-native";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import colors from "../../../constants/colors";
import fonts from "../../../constants/fonts";
import { useState } from "react";
import { RoleList } from "../../../components/members/role-list";
import { SafeAreaView } from "react-native-safe-area-context";
import { MembersPage } from "../../../components/members/members-page";
import { RequestsPage } from "../../../components/requests/requests-page";

const DummyScene = () => <View style={[{ flex: 1 }]} />;

const DummyScene2 = () => <View style={[{ flex: 1 }]} />;

const renderScene = SceneMap({
  members: MembersPage,
  dummy: RequestsPage,
});

export default function MembersLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "members", title: "Members" },
    { key: "dummy", title: "Requests" },
  ]);

  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  return (
    <SafeAreaView
      style={[{ flex: 1, backgroundColor: colors.default.tint[400] }]}
    >
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            style={[{ backgroundColor: colors.default.tint[400] }]}
            labelStyle={[
              {
                fontFamily: fonts.poppinsMedium,
                textTransform: "capitalize",
                fontSize: 16,
              },
            ]}
          />
        )}
      />
    </SafeAreaView>
    // <Stack
    //   screenOptions={{
    //     headerStyle: {
    //       backgroundColor: isLight
    //         ? colors.default.tint[400]
    //         : colors.default.tint[200],
    //     },
    //     headerTitleStyle: {
    //       fontFamily: fonts.poppinsMedium,
    //       color: colors.default.white[100],
    //     },
    //   }}
    // >
    //   <Stack.Screen
    //     name="index"
    //     options={{
    //       title: "Members",
    //     }}
    //   />
    // </Stack>
  );
}
