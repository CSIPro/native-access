import { FC } from "react";
import {
  useDerivedValue,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";
import { z } from "zod";

import { Group, Oval } from "@shopify/react-native-skia";

import colors from "@/constants/colors";

const ParticleStruc = z.object({
  id: z.number(),
  offsetX: z.number(),
  offsetY: z.number(),
  delay: z.number(),
});

export type Particle = z.infer<typeof ParticleStruc>;

interface Props {
  offsetX: number;
  offsetY: number;
  delay: number;
}

export const Particle: FC<Props> = ({ offsetX, offsetY, delay }) => {
  const height = 15;
  const width = 6;

  const yPos = useSharedValue(offsetY);
  const innerYPos = useDerivedValue(() => yPos.value + height / 3);

  yPos.value = withDelay(
    delay,
    withTiming(-(height + height / 3), { duration: 1500 })
  );

  return (
    <Group>
      <Oval
        height={height}
        width={width}
        x={offsetX}
        y={yPos}
        color={colors.default.tint.translucid[600]}
      />
      <Oval
        height={height / 3}
        width={width / 2}
        x={offsetX + width / 4}
        y={innerYPos}
        color={colors.default.tint[300]}
      />
    </Group>
  );
};
