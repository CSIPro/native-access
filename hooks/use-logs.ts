import Constants from "expo-constants";
import {
  Timestamp,
  collection,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { z } from "zod";
import { useRoomContext } from "../context/room-context";
import { useQuery } from "react-query";
import { NestError } from "@/lib/utils";

export const Log = z.object({
  id: z.string(),
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

export const NestAccessType = z.enum(["keypad", "mobile", "webapp"]);

export const NestLog = z.object({
  id: z.string(),
  userId: z.string().nullable(),
  roomId: z.string(),
  accessed: z.boolean(),
  wireless: z.boolean(),
  accessType: NestAccessType,
  attempt: z
    .object({ csiId: z.string(), passcode: z.string() })
    .optional()
    .nullable(),
  createdAt: z.string().datetime(),
  user: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
      dateOfBirth: z.string().date(),
    })
    .optional()
    .nullable(),
});

export type NestLog = z.infer<typeof NestLog>;

export const useNestLogs = ({ limitTo = 40 }: { limitTo?: number } = {}) => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const { selectedRoom } = useRoomContext();

  const logsQuery = useQuery({
    queryKey: ["logs", selectedRoom, limitTo],
    queryFn: async () => {
      const res = await fetch(
        `${apiUrl}/access-logs/room/${selectedRoom}/?limit=${limitTo}`
      );

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching logs");
      }

      const resData = await res.json();
      const logsParse = NestLog.array().safeParse(resData);

      if (!logsParse.success) {
        throw new Error("An error occurred while parsing logs");
      }

      return logsParse.data;
    },
    refetchInterval: 10000,
  });

  return logsQuery;
};
