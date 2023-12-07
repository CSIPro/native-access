import { collectionGroup, query, where } from "firebase/firestore";
import { useContext } from "react";
import { useFirestore, useFirestoreCollection } from "reactfire";

import { RoomContext } from "../context/room-context";
import { Role } from "./use-roles";

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

  if (status === "loading") {
    return { status: "loading" };
  }

  if (status === "error") {
    return { status: "error" };
  }

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

  const reducedDataArray = Object.entries(reducedData).map(([key, value]) => ({
    title: key,
    data: value as string[],
    roleData: roles.find((role) => role.id === key),
  }));

  reducedDataArray.sort((a, b) => {
    return a.roleData?.level - b.roleData?.level ?? 0;
  });

  return {
    status,
    data: reducedDataArray,
  };
};
