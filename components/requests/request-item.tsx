import { FC, useState } from "react";
import {
  useRequestHelpers,
  PopulatedNestRequest,
  NestRequestStatus,
  useNestRequestHelpers,
} from "../../hooks/use-requests";
import {
  Pressable,
  StyleSheet,
  Text,
  View,
  useColorScheme,
} from "react-native";
import { useUserDataWithId } from "../../hooks/use-user-data";
import { useRoom } from "../../hooks/use-rooms";
import colors from "../../constants/colors";
import fonts from "../../constants/fonts";
import { format, formatDistanceToNow } from "date-fns/esm";
import {
  RequestDetails,
  RequestDetailsAdmin,
  RequestDetailsDate,
  RequestDetailsRoom,
  RequestDetailsStatus,
  RequestDetailsUser,
} from "./request-details";
import { formatUserName } from "@/lib/utils";

interface Props {
  request: PopulatedNestRequest;
}

export const RequestItem: FC<Props> = ({ request }) => {
  const [openDetails, setOpenDetails] = useState(false);

  const colorScheme = useColorScheme();
  const { approveRequest, rejectRequest } = useNestRequestHelpers(request);

  const isLight = colorScheme === "light";

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  const handleCloseDetails = () => setOpenDetails(false);

  const handleApprove = () => {
    approveRequest.mutate();
    handleCloseDetails();
  };

  const handleReject = () => {
    rejectRequest.mutate();
    handleCloseDetails();
  };

  const variants: Record<NestRequestStatus, Object> = {
    [NestRequestStatus.enum.pending]: {
      backgroundColor: isLight
        ? colors.default.tintAccent[400]
        : colors.default.tintAccent.translucid[200],
      borderWidth: 2,
      borderColor: isLight
        ? colors.default.tintAccent[600]
        : colors.default.tintAccent[300],
    },
    [NestRequestStatus.enum.approved]: {
      backgroundColor: isLight
        ? colors.default.tint.translucid[800]
        : colors.default.tint.translucid[200],
      borderWidth: 2,
      borderColor: isLight
        ? colors.default.tint[600]
        : colors.default.tint[300],
    },
    [NestRequestStatus.enum.rejected]: {
      backgroundColor: isLight
        ? colors.default.secondary.translucid[700]
        : colors.default.secondary.translucid[200],
      borderWidth: 2,
      borderColor: isLight
        ? colors.default.secondary[600]
        : colors.default.secondary[300],
    },
  };

  return (
    <>
      <Pressable
        onPress={() => setOpenDetails(true)}
        style={[
          styles.item,
          variants[request.status ?? NestRequestStatus.enum.pending],
        ]}
      >
        <View style={[styles.namesWrapper]}>
          <Text numberOfLines={1} style={[styles.itemText]}>
            {formatUserName(request.user)}
          </Text>
          <Text numberOfLines={1} style={[styles.itemText, styles.roomName]}>
            {request.room.name ?? "Unknown"}
          </Text>
        </View>
        <View style={[styles.statusWrapper]}>
          <Text numberOfLines={1} style={[styles.itemText, styles.status]}>
            {NestRequestStatus.enum[request.status]}
          </Text>
          <Text numberOfLines={1} style={[styles.itemText, styles.date]}>
            {formatDistanceToNow(new Date(request.createdAt))} ago
          </Text>
        </View>
      </Pressable>
      <RequestDetails
        isPending={request.status === NestRequestStatus.enum.pending}
        userId={request.user.id}
        open={openDetails}
        onClose={handleCloseDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      >
        <RequestDetailsUser>{formatUserName(request.user)}</RequestDetailsUser>
        <RequestDetailsRoom>{request.room.name}</RequestDetailsRoom>
        {!!request.admin && (
          <RequestDetailsAdmin>
            {formatUserName(request.admin)}
          </RequestDetailsAdmin>
        )}
        <RequestDetailsStatus>
          {NestRequestStatus.enum[request.status]}
        </RequestDetailsStatus>
        <RequestDetailsDate>
          {format(new Date(request.createdAt), "MMM dd, yyyy 'at' HH:mm")}
        </RequestDetailsDate>
      </RequestDetails>
    </>
  );
};

const styles = StyleSheet.create({
  centered: {
    width: "100%",
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontFamily: fonts.inter,
    fontSize: 16,
  },
  item: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 8,
    borderRadius: 8,
  },
  namesWrapper: {
    gap: 2,
    maxWidth: "65%",
  },
  itemText: {
    fontFamily: fonts.interMedium,
    fontSize: 18,
    color: colors.default.white[100],
  },
  roomName: {
    fontSize: 12,
  },
  statusWrapper: {
    gap: 2,
    alignItems: "flex-end",
    maxWidth: "35%",
  },
  status: {
    fontSize: 12,
    textTransform: "capitalize",
  },
  date: {
    fontSize: 12,
  },
});
