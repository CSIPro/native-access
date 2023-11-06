import { ComponentProps, FC } from "react";

import IonIcons from "@expo/vector-icons/Ionicons";

interface Props {
  name: ComponentProps<typeof IonIcons>["name"];
  size?: number;
  color: string;
}

export const IonIcon: FC<Props> = (props) => {
  return <IonIcons size={props.size ?? 30} {...props} />;
};
