import { FC, ReactNode, forwardRef } from "react";
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import { BottomSheetModal, BottomSheetView } from "@gorhom/bottom-sheet";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";

interface Props {
  snapPoints?: string[];
  children: ReactNode;
}

export const BSModal = forwardRef<BottomSheetModal, Props>(function SheetModal(
  { children, snapPoints = ["25%"] },
  sheetRef
) {
  const isLight = useColorScheme() === "light";

  const modalBg = isLight
    ? colors.default.white[300]
    : colors.default.black[300];

  const indicatorColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  return (
    <BottomSheetModal
      ref={sheetRef}
      snapPoints={snapPoints}
      backgroundStyle={[{ backgroundColor: modalBg }]}
      handleIndicatorStyle={[{ backgroundColor: indicatorColor }]}
    >
      {children}
    </BottomSheetModal>
  );
});

interface BSMHeaderProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
}

export const BSMHeader: FC<BSMHeaderProps> = ({
  children,
  style,
  textStyle,
}) => {
  const isLight = useColorScheme() === "light";

  const color = isLight ? colors.default.black[400] : colors.default.white[100];

  const borderBottomColor = isLight
    ? colors.default.gray[400]
    : colors.default.black[100];

  return (
    <View style={[styles.header, { borderBottomColor }, style]}>
      <Text style={[styles.text, styles.headerTitle, { color }, textStyle]}>
        {children}
      </Text>
    </View>
  );
};

interface BSMViewProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BSMBody: FC<BSMViewProps> = ({ children, style }) => {
  return (
    <BottomSheetView style={[styles.container, style]}>
      {children}
    </BottomSheetView>
  );
};

interface BSMFooterProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const BSMFooter: FC<BSMFooterProps> = ({ children, style }) => {
  return <View style={[styles.footer, style]}>{children}</View>;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
    paddingHorizontal: 8,
  },
  header: {
    width: "100%",
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  text: {
    fontSize: 16,
    fontFamily: fonts.poppins,
    paddingTop: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: fonts.poppinsMedium,
  },
  footer: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    paddingVertical: 8,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    gap: 8,
  },
});
