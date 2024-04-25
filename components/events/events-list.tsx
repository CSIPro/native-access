import colors from "@/constants/colors";
import { useEvents, usePastEvents } from "@/hooks/events/use-events";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { IonIcon } from "../icons/ion";
import { FC } from "react";
import fonts from "@/constants/fonts";
import {
  EventItem,
  EventItemDate,
  EventItemDescription,
  EventItemPresenters,
  EventItemTitle,
  EventItemType,
  eventItemTypes,
} from "./event-item";

interface Props {
  past?: boolean;
}

export const EventsList: FC<Props> = ({ past = false }) => {
  return past ? <PastEventsList /> : <ActiveEventsList />;
};

const ActiveEventsList = () => {
  const { status, data, error, refetch } = useEvents();

  if (status === "loading") {
    return (
      <View style={[styles.container]}>
        <View style={[styles.centered]}>
          <ActivityIndicator color={colors.default.tint[400]} />
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.container]}>
        <View style={[styles.centered, { gap: 8 }]}>
          <Text style={[styles.text]}>Couldn't fetch incoming events</Text>
          <Pressable onPress={() => refetch()} style={[styles.refetchButton]}>
            <IonIcon
              name="refresh-circle"
              size={36}
              color={colors.default.tint[400]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        horizontal
        keyExtractor={(item) => `Past event ${item.id}`}
        data={data}
        renderItem={({ item, index }) => (
          <EventItem eventId={item.id}>
            <EventItemTitle>{item.title}</EventItemTitle>
            <EventItemDate date={item.date} />
            <EventItemType>{eventItemTypes[item.type]}</EventItemType>
            <EventItemPresenters presenters={item.presenters} />
            <EventItemDescription>{item.description}</EventItemDescription>
          </EventItem>
        )}
        contentContainerStyle={[styles.listContainer]}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const PastEventsList = () => {
  const { status, data, error, refetch } = usePastEvents();

  if (status === "loading") {
    return (
      <View style={[styles.container]}>
        <View style={[styles.centered]}>
          <ActivityIndicator color={colors.default.tint[400]} />
        </View>
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.container]}>
        <View style={[styles.centered, { gap: 8 }]}>
          <Text style={[styles.text]}>Couldn't fetch incoming events</Text>
          <Pressable onPress={() => refetch()} style={[styles.refetchButton]}>
            <IonIcon
              name="refresh-circle"
              size={36}
              color={colors.default.tint[400]}
            />
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container]}>
      <FlatList
        horizontal
        keyExtractor={(item) => `Past event ${item.id}`}
        data={data}
        renderItem={({ item, index }) => (
          <EventItem eventId={item.id}>
            <EventItemTitle>{item.title}</EventItemTitle>
            <EventItemDate date={item.date} />
            <EventItemType>{eventItemTypes[item.type]}</EventItemType>
            <EventItemPresenters presenters={item.presenters} />
            <EventItemDescription>{item.description}</EventItemDescription>
          </EventItem>
        )}
        contentContainerStyle={[styles.listContainer]}
        showsHorizontalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
    width: "100%",
  },
  centered: {
    flex: 1,
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  listContainer: {
    gap: 8,
    paddingHorizontal: 8,
    alignItems: "stretch",
  },
  refetchButton: {
    borderRadius: 9999,
    backgroundColor: "transparent",
    borderWidth: 2,
    borderColor: colors.default.tint[400],
  },
  text: {
    fontFamily: fonts.inter,
    fontSize: 16,
    color: colors.default.white[100],
  },
});
