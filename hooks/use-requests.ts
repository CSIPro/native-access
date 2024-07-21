import Constants from "expo-constants";
import * as LocalAuthentication from "expo-local-authentication";
import {
  Timestamp,
  addDoc,
  collection,
  doc,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { useFirestore, useFirestoreCollectionData, useUser } from "reactfire";
import { z } from "zod";

import { useRoles } from "./use-roles";

import { RoomContext, useRoomContext } from "../context/room-context";
import { useCallback, useContext } from "react";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { firebaseAuth } from "@/lib/firebase-config";
import { NestError } from "@/lib/utils";

enum RequestStatus {
  pending,
  approved,
  rejected,
}

export const RequestStatusEnum = z.nativeEnum(RequestStatus);
export type RequestStatusEnum = z.infer<typeof RequestStatusEnum>;

export const Request = z.object({
  id: z.string(),
  status: RequestStatusEnum,
  userId: z.string(),
  roomId: z.string(),
  adminId: z.string().nullable().optional(),
  userComment: z.string().nullable().optional(),
  adminComment: z.string().nullable().optional(),
  createdAt: z.custom<Timestamp>(),
  updatedAt: z.custom<Timestamp>(),
});
export type Request = z.infer<typeof Request>;

export const useRoomRequests = () => {
  const roomCtx = useRoomContext();

  const firestore = useFirestore();
  const requestsCol = collection(firestore, "requests");
  const requestsQuery = query(
    requestsCol,
    where("roomId", "==", roomCtx.selectedRoom || ""),
    orderBy("createdAt", "desc")
  );

  const { status, data } = useFirestoreCollectionData(requestsQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status };
  }

  if (status === "error") {
    return { status };
  }

  const requests = data.map((doc) => {
    const requestSafeParse = Request.safeParse(doc);
    const request = requestSafeParse.success ? requestSafeParse.data : null;

    return request;
  });

  return {
    status,
    data: requests,
  };
};

export const useUserRequests = () => {
  const firestore = useFirestore();
  const user = useUser();

  const requestsCol = collection(firestore, "requests");
  const requestsQuery = query(
    requestsCol,
    where("userId", "==", user.data?.uid || "invalid"),
    orderBy("createdAt", "desc")
  );

  const { status, data } = useFirestoreCollectionData(requestsQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status };
  }

  if (status === "error") {
    return { status };
  }

  const requests =
    data?.map((doc) => {
      const requestSafeParse = Request.safeParse(doc);
      const request = requestSafeParse.success ? requestSafeParse.data : null;

      return request;
    }) ?? [];

  return {
    status,
    data: requests,
  };
};

export const useRequestHelpers = (request?: Request) => {
  const queryClient = useQueryClient();
  const user = useUser();
  const firestore = useFirestore();
  const { data: roles } = useRoles();
  const { selectedRoom } = useContext(RoomContext);
  const requestDoc = doc(firestore, "requests", request?.id ?? "invalid");

  const approveRequest = useCallback(async () => {
    if (user.data === null) return;

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to approve request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      const guestRole = roles?.find((role) => role.name === "Guest");
      if (!guestRole) {
        throw new Error("Guest role not found");
      }

      const roomRolesDoc = doc(
        firestore,
        "user_roles",
        request.userId,
        "room_roles",
        request.roomId
      );

      await updateDoc(requestDoc, {
        status: RequestStatusEnum.enum.approved,
        adminId: user.data?.uid,
        updatedAt: Timestamp.now(),
      });

      await setDoc(roomRolesDoc, {
        roleId: guestRole.id,
        accessGranted: true,
        key: request.roomId,
      });

      queryClient.invalidateQueries(["members", selectedRoom]);
    } catch (error) {
      console.error(error);
    }
  }, [user.data, request, roles, firestore, requestDoc]);

  const rejectRequest = useCallback(async () => {
    if (user.data === null) return;

    try {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to reject request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      await updateDoc(requestDoc, {
        status: RequestStatusEnum.enum.rejected,
        adminId: user.data?.uid,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error(error);
    }
  }, [user.data, request, firestore, requestDoc]);

  const createRequest = useCallback(
    async (roomId: string) => {
      if (user.data === null) throw new Error("User not found");

      try {
        const requestsCol = collection(firestore, "requests");
        const timestamp = Timestamp.now();

        await addDoc(requestsCol, {
          status: RequestStatusEnum.enum.pending,
          userId: user.data.uid,
          roomId,
          createdAt: timestamp,
          updatedAt: timestamp,
        });
      } catch (error) {
        console.error(error);

        throw new Error("Failed to create request, please try again later");
      }
    },
    [user.data, firestore]
  );

  return !!request
    ? ({
        approveRequest: approveRequest,
        rejectRequest: rejectRequest,
        createRequest,
      } as const)
    : ({
        createRequest,
      } as const);
};

export const NestRequestStatus = z.enum(["pending", "approved", "rejected"]);
export type NestRequestStatus = z.infer<typeof NestRequestStatus>;

export const PlainNestRequest = z.object({
  id: z.string(),
  userId: z.string(),
  roomId: z.string(),
  adminId: z.string().optional().nullable(),
  status: NestRequestStatus,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
});

export type PlainNestRequest = z.infer<typeof PlainNestRequest>;

export const PopulatedNestRequest = z.object({
  id: z.string(),
  status: NestRequestStatus,
  createdAt: z.string().datetime({ offset: true }),
  updatedAt: z.string().datetime({ offset: true }),
  user: z.object({
    id: z.string(),
    firstName: z.string(),
    lastName: z.string(),
  }),
  admin: z
    .object({
      id: z.string(),
      firstName: z.string(),
      lastName: z.string(),
    })
    .optional()
    .nullable(),
  room: z.object({
    id: z.string(),
    name: z.string(),
    building: z.string(),
    roomNumber: z.string(),
  }),
});

export type PopulatedNestRequest = z.infer<typeof PopulatedNestRequest>;

export const useNestRoomRequests = (roomId?: string) => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const authUser = firebaseAuth.currentUser;
  const { selectedRoom } = useRoomContext();

  const requestsQuery = useQuery({
    queryKey: ["requests", roomId ?? selectedRoom],
    queryFn: async () => {
      const res = await fetch(
        `${apiUrl}/rooms/${roomId ?? selectedRoom}/requests`,
        {
          headers: {
            Authorization: `Bearer ${await authUser?.getIdToken()}`,
          },
        }
      );

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching requests");
      }

      const requestsParse = PopulatedNestRequest.array().safeParse(
        await res.json()
      );

      if (!requestsParse.success) {
        throw new Error("An error occurred while parsing requests");
      }

      return requestsParse.data;
    },
  });

  return requestsQuery;
};

export const useNestUserRequests = (userId: string) => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const authUser = firebaseAuth.currentUser;

  const requestsQuery = useQuery({
    queryKey: ["requests", userId],
    queryFn: async () => {
      const res = await fetch(`${apiUrl}/users/${userId}/requests`, {
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while fetching requests");
      }

      const requestsParse = PopulatedNestRequest.array().safeParse(
        await res.json()
      );

      if (!requestsParse.success) {
        throw new Error("An error occurred while parsing requests");
      }

      return requestsParse.data;
    },
    refetchInterval: 120000,
  });

  return requestsQuery;
};

export const useNestRequestHelpers = (request?: PopulatedNestRequest) => {
  const apiUrl = Constants.expoConfig.extra?.authApiUrl;
  const authUser = firebaseAuth.currentUser;
  const queryClient = useQueryClient();

  const approval = useMutation({
    mutationFn: async () => {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to approve request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      const res = await fetch(`${apiUrl}/requests/${request.id}/approve`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while approving request");
      }

      queryClient.invalidateQueries(["requests", request.room.id]);
      queryClient.invalidateQueries(["members", request.room.id]);
    },
  });

  const rejection = useMutation({
    mutationFn: async () => {
      const auth = await LocalAuthentication.authenticateAsync({
        promptMessage: "Authenticate to reject request",
      });

      if (!auth.success) {
        throw new Error("Authentication failed");
      }

      const res = await fetch(`${apiUrl}/requests/${request.id}/reject`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while rejecting request");
      }

      queryClient.invalidateQueries(["requests", request.room.id]);
      queryClient.invalidateQueries(["members", request.room.id]);
    },
  });

  const createRequest = useMutation<void, Error, string>({
    mutationFn: async (roomId: string) => {
      const res = await fetch(`${apiUrl}/requests`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
        body: JSON.stringify({ roomId }),
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        }

        throw new Error("An error occurred while creating request");
      }

      queryClient.invalidateQueries(["requests", roomId]);
    },
  });

  return {
    approveRequest: approval,
    rejectRequest: rejection,
    createRequest: createRequest,
  };
};
