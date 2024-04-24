import {
  FlatList,
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import colors from "@/constants/colors";
import { FC, ReactNode } from "react";
import fonts from "@/constants/fonts";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BrandingHeaderHighlight } from "../ui/branding-header";
import { IonIcon } from "../icons/ion";

interface EventItemProps {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EventItem: FC<EventItemProps> = ({ children, style }) => {
  return <View style={[styles.container, style]}>{children}</View>;
};

interface TitleProps {
  style?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const EventItemTitle: FC<TitleProps> = ({ children, style }) => {
  return (
    <Text numberOfLines={2} style={[styles.text, styles.title, style]}>
      {children}
    </Text>
  );
};

interface DateProps {
  date: Date;
  style?: StyleProp<ViewStyle>;
}

export const EventItemDate: FC<DateProps> = ({ date, style }) => {
  const formattedDate = format(date, "MMMM dd yyyy '-' p", { locale: es });

  return (
    <View style={[styles.dateContainer, style]}>
      <Text style={[styles.text, styles.dateFormat]}>{formattedDate}</Text>
    </View>
  );
};

interface TypeProps {
  textStyle?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

export const eventItemTypes = {
  conference: "Conferencia",
  workshop: "Taller",
  course: "Curso",
};

export const EventItemType: FC<TypeProps> = ({
  children,
  textStyle,
  highlightStyle,
}) => {
  return (
    <View style={[styles.typeContainer]}>
      <BrandingHeaderHighlight
        textStyle={[{ fontSize: 14 }, textStyle]}
        highlightStyle={[
          { borderRadius: 0, borderTopLeftRadius: 8 },
          highlightStyle,
        ]}
      >
        {children}
      </BrandingHeaderHighlight>
    </View>
  );
};

interface PresentersProps {
  presenters: string[];
}

export const EventItemPresenters: FC<PresentersProps> = ({ presenters }) => {
  return (
    <FlatList
      keyExtractor={(item) => item}
      data={presenters.slice(0, 2)}
      renderItem={(item) => (
        <View style={[styles.presenterContainer]}>
          <IonIcon name="person" size={16} color={colors.default.tint[400]} />
          <Text numberOfLines={1} style={[styles.text]}>
            {item.item}
          </Text>
        </View>
      )}
      ListFooterComponent={
        presenters.length > 2 ? (
          <View style={[styles.presenterContainer]}>
            <View style={[{ width: 18 }]} />
            <Text style={[styles.text]}>y {presenters.length - 2} más</Text>
          </View>
        ) : null
      }
    />
  );
};

export const EventItemDescription: FC<TitleProps> = ({ children, style }) => {
  return (
    <Text numberOfLines={2} style={[styles.text, styles.description, style]}>
      {children}
    </Text>
  );
};

const styles = StyleSheet.create({
  container: {
    width: 240,
    // height: "100%",
    gap: 4,
    padding: 8,
    paddingBottom: 40,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: colors.default.tint[400],
    backgroundColor: colors.default.tint.translucid[100],
    overflow: "hidden",
  },
  title: {
    fontFamily: fonts.interBold,
    fontSize: 18,
  },
  dateContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 4,
  },
  dateFormat: {
    fontFamily: fonts.interMedium,
    textTransform: "uppercase",
  },
  typeContainer: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
  presenterContainer: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center",
  },
  description: {
    color: colors.default.white[100],
  },
  text: {
    fontFamily: fonts.inter,
    color: colors.default.white[100],
    fontSize: 16,
  },
});
