import { IonIcon } from "@/components/icons/ion";
import { MaterialIcon } from "@/components/icons/material";
import {
  BrandingHeader,
  BrandingHeaderHighlight,
  BrandingHeaderTitle,
} from "@/components/ui/branding-header";
import { TextButton } from "@/components/ui/text-button";
import colors from "@/constants/colors";
import fonts from "@/constants/fonts";
import { useEvent } from "@/hooks/events/use-events";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Link, Stack, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

const headerOptions = {
  headerShown: true,
  headerTitle: "Detalles del evento",
  headerStyle: { backgroundColor: colors.default.tint[400] },
  headerTintColor: colors.default.white[100],
};

export default function EventDetails() {
  const window = useWindowDimensions();

  const { id } = useLocalSearchParams<{ id: string }>();
  const { status, data, error, refetch } = useEvent(id);

  if (status === "loading") {
    return (
      <View style={[styles.container, styles.centered]}>
        <Stack.Screen options={headerOptions} />
        <ActivityIndicator color={colors.default.tint[400]} size="large" />
      </View>
    );
  }

  if (status === "error") {
    return (
      <View style={[styles.container, styles.centered, { gap: 8 }]}>
        <Stack.Screen options={headerOptions} />
        <Text style={[styles.text, styles.centerText]}>
          No se pudieron obtener los datos del evento
        </Text>
        <TextButton onPress={() => refetch()}>Retry</TextButton>
      </View>
    );
  }

  const formattedDate = format(data.date, "PPP", { locale: es });
  const formattedTime = format(data.date, "p", { locale: es });

  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { paddingBottom: window.height * 0.4 },
      ]}
    >
      <Stack.Screen options={headerOptions} />
      <Text style={[styles.text, styles.title]}>{data.title}</Text>
      <Text style={[styles.text]}>{data.description}</Text>
      <View style={[styles.infoContainer]}>
        <View style={[styles.infoSubtitleContainer]}>
          <Text style={[styles.text, styles.infoSubtitle]}>Lugar y fecha</Text>
        </View>
        <View style={[styles.dateRow]}>
          <View style={[styles.dateContainer, { flex: 2 }]}>
            <MaterialIcon
              name="event"
              size={24}
              color={colors.default.white[100]}
            />
            <Text style={[styles.text]}>{formattedDate}</Text>
          </View>
          <View style={[styles.dateContainer]}>
            <IonIcon name="time" size={24} color={colors.default.white[100]} />
            <Text style={[styles.text]}>{formattedTime}</Text>
          </View>
        </View>
        <View style={[styles.infoItemContainer]}>
          <MaterialIcon
            name="room"
            size={24}
            color={colors.default.white[100]}
          />
          <Text style={[styles.text]}>{data.location}</Text>
        </View>
        <View style={[styles.infoSubtitleContainer]}>
          <Text style={[styles.text, styles.infoSubtitle]}>Presentadores</Text>
        </View>
        <FlatList
          scrollEnabled={false}
          data={data.presenters}
          renderItem={(item) => (
            <View style={[styles.infoItemContainer]}>
              <IonIcon
                name="person"
                size={16}
                color={colors.default.white[100]}
              />
              <Text style={[styles.text]}>{item.item}</Text>
            </View>
          )}
          contentContainerStyle={[styles.presenterListContainer]}
        />
      </View>
      <View
        style={[
          {
            flexDirection: "row",
            justifyContent: "flex-end",
            paddingVertical: 8,
            minHeight: 48,
          },
        ]}
      >
        <BrandingHeader style={[{ ...StyleSheet.absoluteFillObject }]}>
          <BrandingHeaderTitle>EVENT</BrandingHeaderTitle>
          <BrandingHeaderHighlight>ATTENDEES</BrandingHeaderHighlight>
        </BrandingHeader>
        <Link href={`events/${id}/scanner`} asChild>
          <Pressable>
            <View
              style={[
                {
                  padding: 4,
                  paddingHorizontal: 8,
                  backgroundColor: colors.default.tint.translucid[300],
                  borderRadius: 4,
                },
              ]}
            >
              <Text
                style={[
                  styles.text,
                  {
                    textTransform: "uppercase",
                    fontSize: 18,
                    fontFamily: fonts.interMedium,
                    color: colors.default.tint[100],
                  },
                ]}
              >
                Add
              </Text>
            </View>
          </Pressable>
        </Link>
      </View>
      <FlatList
        data={data.attendees}
        scrollEnabled={false}
        renderItem={(item) => (
          <View style={[styles.infoItemContainer]}>
            <Text style={[styles.text]}>{item.item}</Text>
          </View>
        )}
        contentContainerStyle={[styles.atendeesContainer]}
        ListEmptyComponent={
          <View style={[styles.centered]}>
            <Text style={[styles.text]}>No se han registrado asistentes</Text>
          </View>
        }
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.default.tint[400],
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    backgroundColor: colors.default.black[400],
    padding: 8,
    gap: 6,
  },
  title: {
    fontSize: 24,
    fontFamily: fonts.interMedium,
  },
  infoContainer: {
    width: "100%",
    borderWidth: 2,
    borderColor: colors.default.tint[400],
    borderRadius: 8,
    backgroundColor: colors.default.tint.translucid[100],
    padding: 4,
    gap: 4,
  },
  infoSubtitleContainer: {
    width: "100%",
    backgroundColor: colors.default.tint[400],
    borderRadius: 4,
    paddingVertical: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  infoSubtitle: {
    fontFamily: fonts.interMedium,
    fontSize: 18,
  },
  presenterListContainer: {
    width: "100%",
    gap: 4,
  },
  infoItemContainer: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
    backgroundColor: colors.default.tint.translucid[300],
    borderRadius: 4,
  },
  dateRow: {
    flexDirection: "row",
    width: "100%",
    gap: 4,
  },
  dateContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
    gap: 4,
    borderRadius: 4,
    backgroundColor: colors.default.tint.translucid[300],
  },
  atendeesContainer: {
    width: "100%",
    minHeight: 200,
    backgroundColor: colors.default.tint.translucid[100],
    borderRadius: 8,
    padding: 4,
    gap: 4,
    borderWidth: 2,
    borderColor: colors.default.tint[400],
  },
  text: {
    color: colors.default.white[100],
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  centerText: {
    textAlign: "center",
  },
});
