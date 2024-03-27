import { FC, useState } from "react";
import {
  RequestStatusEnum,
  type Request,
  useRequestHelpers,
} from "../../hooks/use-requests";
import {
  ActivityIndicator,
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

interface Props {
  request: Request;
}

export const RequestItem: FC<Props> = ({ request }) => {
  const [openDetails, setOpenDetails] = useState(false);

  const colorScheme = useColorScheme();
  const { approveRequest, rejectRequest } = useRequestHelpers(request);
  const { status: userStatus, data: userData } = useUserDataWithId(
    request.userId
  );
  const { status: adminStatus, data: adminData } = useUserDataWithId(
    request.adminId
  );
  const { status: roomStatus, data: roomData } = useRoom(request.roomId);

  const isLight = colorScheme === "light";

  const tint = isLight ? colors.default.tint[400] : colors.default.tint[200];
  const textColor = isLight
    ? colors.default.white[100]
    : colors.default.black[400];

  const handleCloseDetails = () => setOpenDetails(false);

  const handleApprove = () => {
    approveRequest();
    handleCloseDetails();
  };

  const handleReject = () => {
    rejectRequest();
    handleCloseDetails();
  };

  if (
    userStatus === "loading" ||
    adminStatus === "loading" ||
    roomStatus === "loading"
  ) {
    return (
      <View style={[styles.centered]}>
        <ActivityIndicator size="large" color={tint} />
      </View>
    );
  }

  if (
    userStatus === "error" ||
    adminStatus === "error" ||
    roomStatus === "error"
  ) {
    return (
      <View style={[styles.centered]}>
        <Text style={[styles.errorText, { color: textColor }]}>
          There's a problem with this request
        </Text>
      </View>
    );
  }

  const variants: Record<RequestStatusEnum, Object> = {
    [RequestStatusEnum.enum.pending]: {
      backgroundColor: isLight
        ? colors.default.tintAccent[400]
        : colors.default.tintAccent.translucid[200],
      borderWidth: 2,
      borderColor: isLight
        ? colors.default.tintAccent[600]
        : colors.default.tintAccent[300],
    },
    [RequestStatusEnum.enum.approved]: {
      backgroundColor: isLight
        ? colors.default.tint.translucid[800]
        : colors.default.tint.translucid[200],
      borderWidth: 2,
      borderColor: isLight
        ? colors.default.tint[600]
        : colors.default.tint[300],
    },
    [RequestStatusEnum.enum.rejected]: {
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
          variants[request.status ?? RequestStatusEnum.enum.pending],
        ]}
      >
        <View style={[styles.namesWrapper]}>
          <Text numberOfLines={1} style={[styles.itemText]}>
            {userData?.name ?? "Unknown"}
          </Text>
          <Text numberOfLines={1} style={[styles.itemText, styles.roomName]}>
            {roomData?.name ?? "Unknown"}
          </Text>
        </View>
        <View style={[styles.statusWrapper]}>
          <Text numberOfLines={1} style={[styles.itemText, styles.status]}>
            {RequestStatusEnum.enum[request.status]}
          </Text>
          <Text numberOfLines={1} style={[styles.itemText, styles.date]}>
            {formatDistanceToNow(request.createdAt.toDate())} ago
          </Text>
        </View>
      </Pressable>
      <RequestDetails
        isPending={request.status === RequestStatusEnum.enum.pending}
        userId={request.userId}
        open={openDetails}
        onClose={handleCloseDetails}
        onApprove={handleApprove}
        onReject={handleReject}
      >
        <RequestDetailsUser>{userData?.name}</RequestDetailsUser>
        <RequestDetailsRoom>{roomData?.name}</RequestDetailsRoom>
        {!!request.adminId && (
          <RequestDetailsAdmin>{adminData?.name}</RequestDetailsAdmin>
        )}
        <RequestDetailsStatus>
          {RequestStatusEnum.enum[request.status]}
        </RequestDetailsStatus>
        <RequestDetailsDate>
          {format(request.createdAt.toDate(), "MMM dd, yyyy 'at' HH:mm")}
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
