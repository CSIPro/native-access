import { FC, ReactNode, forwardRef, useCallback } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
  useColorScheme,
} from "react-native";

import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from "@gorhom/bottom-sheet";

import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { TextButton } from "./text-button";

interface Props {
  snapPoints?: string[];
  children: ReactNode;
  onDismiss?: () => void;
}

export const BSModal = forwardRef<BottomSheetModal, Props>(function SheetModal(
  { children, snapPoints = ["25%"], onDismiss },
  sheetRef
) {
  const isLight = useColorScheme() === "light";

  const renderBackdrop = useCallback(
    (props) => <BottomSheetBackdrop {...props} />,
    []
  );

  const modalBg = isLight
    ? colors.default.white[300]
    : colors.default.black[300];

  const indicatorColor = isLight
    ? colors.default.black[400]
    : colors.default.white[100];

  return (
    <BottomSheetModal
      ref={sheetRef}
      index={1}
      onDismiss={onDismiss}
      snapPoints={snapPoints}
      backdropComponent={renderBackdrop}
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
  action?: () => void;
  actionLabel?: string;
}

export const BSMHeader: FC<BSMHeaderProps> = ({
  children,
  style,
  textStyle,
  action,
  actionLabel = "Done",
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
      {action && <TextButton onPress={action}>{actionLabel}</TextButton>}
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
  textButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
