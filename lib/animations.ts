import { useEffect, useState } from "react";
import {
  Easing,
  SharedValue,
  cancelAnimation,
  makeMutable,
  useSharedValue,
  withRepeat,
  withTiming,
} from "react-native-reanimated";

export const useLoop = ({ duration }: { duration: number }) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withRepeat(
      withTiming(1, { duration, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );

    return () => {
      cancelAnimation(progress);
    };
  }, [duration, progress]);

  return progress;
};

export const useSharedValues = (...initValues: number[]) => {
  const [mutable] = useState(() => {
    const values: SharedValue<number>[] = [];

    for (const key of initValues) {
      values.push(makeMutable(key));
    }

    return values;
  });

  useEffect(() => {
    return () => {
      Object.keys(mutable).forEach((_, i) => {
        cancelAnimation(mutable[i]);
      });
    };
  }, [mutable]);

  return mutable;
};
