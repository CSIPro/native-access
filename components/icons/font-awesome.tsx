import { ComponentProps, FC } from "react";

import { FontAwesome5 } from "@expo/vector-icons";

interface Props {
  name: ComponentProps<typeof FontAwesome5>["name"];
  size?: number;
  color: string;
}

export const FAIcon: FC<Props> = (props) => {
  return <FontAwesome5 size={props.size ?? 30} {...props} />;
};
