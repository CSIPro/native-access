import { useEvents, usePastEvents } from "@/hooks/events/use-events";
import { StyleSheet, View } from "react-native";

export const EventsList = () => {};

const ActiveEventsList = () => {
  const { status, data, error } = useEvents();
};

const PastEventsList = () => {
  const { status, data, error } = usePastEvents();

  if (status === "loading") {
    return <View></View>;
  }
};

const styles = StyleSheet.create({});
