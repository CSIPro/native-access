import {
  Timestamp,
  collection,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useContext } from "react";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { z } from "zod";
import { useRoomContext } from "../context/room-context";

export const Log = z.object({
  accessed: z.boolean(),
  bluetooth: z.boolean(),
  room: z.string(),
  timestamp: z.custom<Timestamp>(),
  user: z.string().optional(),
  attemptData: z
    .object({
      csiId: z.string(),
      passcode: z.string(),
    })
    .optional(),
});

export type Log = z.infer<typeof Log>;

interface UseLogsProps {
  today?: boolean;
  limitTo?: number;
}

export const useLogs = ({ today = true, limitTo = 40 }: UseLogsProps = {}) => {
  const roomCtx = useRoomContext();

  const firestore = useFirestore();
  const logsCol = collection(firestore, "logs");
  const logsQuery = today
    ? query(
        logsCol,
        where("room", "==", roomCtx.selectedRoom || ""),
        where(
          "timestamp",
          ">=",
          Timestamp.fromDate(new Date(new Date().setHours(0, 0, 0, 0)))
        ),
        orderBy("timestamp", "desc")
      )
    : query(
        logsCol,
        where("room", "==", roomCtx.selectedRoom || ""),
        orderBy("timestamp", "desc"),
        limit(limitTo)
      );
  const { status, data } = useFirestoreCollectionData(logsQuery, {
    idField: "id",
  });

  return {
    status,
    data: data as Log[],
  };
};

export const useSuccessfulLogs = () => {
  const { status: logsStatus, data: logsData } = useLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const successfulLogs = logsData?.filter((log) => log.accessed) ?? [];

  return { status: logsStatus, logs: successfulLogs as Log[] };
};

export const useFailedLogs = () => {
  const { status: logsStatus, data: logsData } = useLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const failedLogs = logsData?.filter((log) => !log.accessed) ?? [];

  return { status: logsStatus, logs: failedLogs as Log[] };
};

export const useBluetoothLogs = () => {
  const { status: logsStatus, data: logsData } = useLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const bluetoothLogs = logsData?.filter((log) => log.bluetooth) ?? [];

  return { status: logsStatus, logs: bluetoothLogs as Log[] };
};

export const useUnknownLogs = () => {
  const { status: logsStatus, data: logsData } = useLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const unknownLogs = logsData?.filter((log) => !log.user) ?? [];

  return { status: logsStatus, logs: unknownLogs as Log[] };
};

export const useUserLogs = () => {
  const { status: userStatus, data: userData } = useUser();
  const { status: logsStatus, data: logsData } = useLogs();

  if (logsStatus === "loading" || userStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error" || userStatus === "error") {
    return { status: "error" };
  }

  const userAttempts =
    logsData?.filter((log) => log.user === userData!.uid) ?? [];

  return {
    status: logsStatus,
    logs: userAttempts as Log[],
  };
};

export const useUserSuccessfulLogs = () => {
  const { status: logsStatus, logs: logsData } = useUserLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const successfulLogs = logsData?.filter((log) => log.accessed) ?? [];

  return { status: logsStatus, logs: successfulLogs as Log[] };
};

export const useUserBluetoothLogs = () => {
  const { status: logsStatus, logs: logsData } = useUserSuccessfulLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const successfulLogs = logsData?.filter((log) => log.bluetooth) ?? [];

  return { status: logsStatus, logs: successfulLogs as Log[] };
};

export const useUserFailedLogs = () => {
  const { status: logsStatus, logs: logsData } = useUserLogs();

  if (logsStatus === "loading") {
    return { status: "loading" };
  }

  if (logsStatus === "error") {
    return { status: "error" };
  }

  const successfulLogs = logsData?.filter((log) => !log.accessed) ?? [];

  return { status: logsStatus, logs: successfulLogs as Log[] };
};
