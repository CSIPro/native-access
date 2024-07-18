import {
  FlatList,
  Pressable,
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
import { Link } from "expo-router";

interface EventItemProps {
  eventId: string;
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

export const EventItem: FC<EventItemProps> = ({ eventId, children, style }) => {
  return (
    <Link href={`events/${eventId}`} asChild>
      <Pressable>
        <View style={[styles.container, style]}>{children}</View>
      </Pressable>
    </Link>
  );
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
  const formattedDate = format(date, "MMM dd yyyy'-'p", { locale: es }).split(
    "-"
  );

  return (
    <View style={[styles.dateContainer, style]}>
      <Text style={[styles.text, styles.dateFormat]}>{formattedDate[0]}</Text>
      <Text style={[styles.text, styles.dateFormat]}>{formattedDate[1]}</Text>
    </View>
  );
};

interface TypeProps {
  textStyle?: StyleProp<TextStyle>;
  highlightStyle?: StyleProp<TextStyle>;
  children: ReactNode;
}

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
  presenters?: string[];
}

export const EventItemPresenters: FC<PresentersProps> = ({
  presenters = [],
}) => {
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

interface AttendantsProps {
  attendants: number;
}

export const EventItemAttendees: FC<AttendantsProps> = ({ attendants }) => {
  return (
    <View style={[styles.attendantsContainer]}>
      <BrandingHeaderHighlight
        textStyle={[{ fontSize: 14 }]}
        highlightStyle={[{ borderRadius: 0, borderTopRightRadius: 8 }]}
      >
        {attendants} asistentes
      </BrandingHeaderHighlight>
    </View>
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
    width: "100%",
    padding: 4,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 4,
    backgroundColor: colors.default.tint[400],
    borderRadius: 8,
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
  attendantsContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
  },
  text: {
    fontFamily: fonts.inter,
    color: colors.default.white[100],
    fontSize: 16,
  },
});
