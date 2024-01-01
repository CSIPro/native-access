import { useState } from "react";
import { SceneMap, TabBar, TabView } from "react-native-tab-view";
import { SafeAreaView } from "react-native-safe-area-context";

import { MembersPage } from "@/components/members/members-page";
import { RequestsPage } from "@/components/requests/requests-page";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

const renderScene = SceneMap({
  members: MembersPage,
  requests: RequestsPage,
});

export default function MembersLayout() {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "members", title: "Members" },
    { key: "requests", title: "Requests" },
  ]);

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
            style={[
              {
                backgroundColor: colors.default.tint[400],
              },
            ]}
            labelStyle={[
              {
                fontFamily: fonts.poppinsMedium,
                textTransform: "capitalize",
                fontSize: 16,
              },
            ]}
            indicatorStyle={[
              {
                backgroundColor: colors.default.white[100],
              },
            ]}
          />
        )}
      />
    </SafeAreaView>
  );
}
