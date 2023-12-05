import { View, useColorScheme } from "react-native";

import colors from "../../constants/colors";
import { RoleList } from "../../components/members/role-list";

export default function Members() {
  const colorScheme = useColorScheme();

  const isLight = colorScheme === "light";

  return (
    <View
      style={{
        flex: 1,
        gap: 8,
        backgroundColor: isLight
          ? colors.default.white[100]
          : colors.default.black[400],
      }}
    >
      <RoleList />
    </View>
  );
}
