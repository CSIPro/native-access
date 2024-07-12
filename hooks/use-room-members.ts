import {
  DocumentData,
  QuerySnapshot,
  collectionGroup,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { useCallback, useContext } from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";

import { RoomContext, useRoomContext } from "../context/room-context";
import { NestRole, Role } from "./use-roles";
import { useQuery } from "react-query";
import { firebaseAuth } from "@/lib/firebase-config";
import { NestError } from "@/lib/utils";
import { z } from "zod";
import { NestRoom } from "./use-rooms";
import { NestUser } from "./use-user-data";

export const useRoomMembers = () => {
  const { selectedRoom } = useContext(RoomContext);

  const firestore = useFirestore();
  const roomRoles = collectionGroup(firestore, "room_roles");
  const roomRolesQuery = query(roomRoles, where("key", "==", selectedRoom));
  const { status, data } = useFirestoreCollection(roomRolesQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status: "loading", data: null };
  }

  if (status === "error") {
    return { status: "error", data: null };
  }

  return {
    status,
    data,
  };
};

export const useRoomMembersByRole = (roleId: string) => {
  const { selectedRoom } = useContext(RoomContext);

  const firestore = useFirestore();
  const roomRoles = collectionGroup(firestore, "room_roles");
  const roomRolesQuery = query(
    roomRoles,
    where("key", "==", selectedRoom),
    where("roleId", "==", roleId)
  );
  const { status, data } = useFirestoreCollection(roomRolesQuery, {
    idField: "id",
  });

  if (status === "loading") {
    return { status: "loading" };
  }

  if (status === "error") {
    return { status: "error" };
  }

  return {
    status,
    data,
  };
};

export const useReducedMembersByRole = (roles: Role[]) => {
  const { selectedRoom } = useContext(RoomContext);
  const roleIds = roles.map((role) => role.id);

  const firestore = useFirestore();
  const roomRoles = collectionGroup(firestore, "room_roles");
  const roomRolesQuery = query(
    roomRoles,
    where("key", "==", selectedRoom),
    where("roleId", "in", roleIds)
  );
  const { status, data } = useFirestoreCollection(roomRolesQuery, {
    idField: "id",
  });

  const reduceMembers = useCallback(
    (data: QuerySnapshot<DocumentData>) => {
      const reducedData = data.docs.reduce(
        (acc, doc) => {
          const { roleId } = doc.data();
          const userId = doc.ref.parent.parent?.id;

          return {
            ...acc,
            [roleId]: [...(acc[roleId] || []), userId],
          };
        },
        roleIds.reduce((acc, roleId) => ({ ...acc, [roleId]: [] }), {})
      );

      const reducedDataArray = Object.entries(reducedData).map(
        ([key, value]) => ({
          title: key,
          data: value as string[],
          roleData: roles.find((role) => role.id === key),
        })
      );

      reducedDataArray.sort((a, b) => {
        return a.roleData?.level - b.roleData?.level ?? 0;
      });

      return reducedDataArray;
    },
    [roleIds, roles]
  );

  if (status === "loading") {
    return { status: "loading" };
  }

  if (status === "error") {
    return { status: "error" };
  }

  const reducedDataArray = reduceMembers(data);

  return {
    status,
    data: reducedDataArray,
  };
};

export const useMembersQuery = (roles: Role[]) => {
  const firestore = useFirestore();
  const { selectedRoom } = useContext(RoomContext);
  const roleIds = roles.map((role) => role.id);
  const { status, data, error } = useQuery({
    queryKey: ["members", selectedRoom],
    queryFn: async () => {
      const roomRoles = collectionGroup(firestore, "room_roles");
      const roomRolesQuery = query(
        roomRoles,
        where("key", "==", selectedRoom),
        where("roleId", "in", roleIds)
      );

      const docs = (await getDocs(roomRolesQuery)).docs;
      const reducedData = docs.reduce(
        (acc, doc) => {
          const { roleId } = doc.data();
          const userId = doc.ref.parent.parent?.id;

          return {
            ...acc,
            [roleId]: [...(acc[roleId] || []), userId],
          };
        },
        roleIds.reduce((acc, roleId) => ({ ...acc, [roleId]: [] }), {})
      );

      const reducedDataArray = Object.entries(reducedData).map(
        ([key, value]) => ({
          title: key,
          data: value as string[],
          roleData: roles.find((role) => role.id === key),
        })
      );

      reducedDataArray.sort((a, b) => {
        return a.roleData?.level - b.roleData?.level ?? 0;
      });

      return reducedDataArray;
    },
    refetchInterval: 60000,
  });

  return {
    status,
    data,
    error,
  };
};

export const Member = z.object({
  id: z.string(),
  canAccess: z.boolean(),
  user: NestUser.partial(),
  role: NestRole.partial(),
  room: NestRoom.partial(),
});

export type Member = z.infer<typeof Member>;

export const RoleWithMembers = z.object({
  id: z.string(),
  name: z.string(),
  level: z.number(),
  members: Member.array(),
});

export type RoleWithMembers = z.infer<typeof RoleWithMembers>;

export const useNestMembers = (roomId?: string) => {
  const authUser = firebaseAuth.currentUser;
  const { selectedRoom } = useRoomContext();

  const membersQuery = useQuery({
    queryKey: ["members", roomId ?? selectedRoom],
    queryFn: async () => {
      const apiUrl = `http://148.225.50.130:3000/rooms/${
        roomId ?? selectedRoom
      }/members`;

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        } else {
          throw new Error("Failed to fetch members data");
        }
      }

      const membersParse = Member.array().safeParse(await res.json());

      if (!membersParse.success) {
        console.log(membersParse);

        throw new Error("An error occurred while parsing members data");
      }

      return membersParse.data;
    },
  });

  return membersQuery;
};

export const useNestMembersByRole = (roomId?: string) => {
  const authUser = firebaseAuth.currentUser;
  const { selectedRoom } = useRoomContext();

  const membersQuery = useQuery({
    queryKey: ["members", roomId ?? selectedRoom],
    queryFn: async () => {
      const apiUrl = `http://148.225.50.130:3000/rooms/${
        roomId ?? selectedRoom
      }/members?groupByRole=true`;

      const res = await fetch(apiUrl, {
        headers: {
          Authorization: `Bearer ${await authUser?.getIdToken()}`,
        },
      });

      if (!res.ok) {
        const errorParse = NestError.safeParse(await res.json());

        if (errorParse.success) {
          throw new Error(errorParse.data.message);
        } else {
          throw new Error("Failed to fetch members data");
        }
      }

      const data = await res.json();
      const groupedMembersParse = RoleWithMembers.array().safeParse(data);

      if (!groupedMembersParse.success) {
        console.log(groupedMembersParse);

        throw new Error("An error occurred while parsing members data");
      }

      const mappedData = groupedMembersParse.data.map((group) => {
        return {
          key: group.id,
          title: group.name,
          level: group.level,
          data: [...group.members],
        };
      });

      return mappedData;
    },
    retryDelay: 5000,
    refetchInterval: 20000,
  });

  return membersQuery;
};
