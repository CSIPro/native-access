import { ComponentProps, FC } from "react";

import MaterialIcons from "@expo/vector-icons/MaterialIcons";

interface Props {
  name: ComponentProps<typeof MaterialIcons>["name"];
  size?: number;
  color: string;
}

export const MaterialIcon: FC<Props> = (props) => {
  return <MaterialIcons size={props.size ?? 30} {...props} />;
};
