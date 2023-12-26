import { StateCreator } from "zustand";
import { Role } from "../hooks/use-roles";

export interface RolesSlice {
  roles: {
    roles: Role[];
    userRole?: Role;
    setRoles: (roles: Role[]) => void;
    setUserRole: (roleId: string) => void;
  };
}

export const createRolesSlice: StateCreator<RolesSlice> = (set, get) => {
  return {
    roles: {
      roles: [],
      userRole: undefined,
      setRoles: (roles) => {
        if (!roles) return;

        set((state) => ({
          roles: {
            ...state.roles,
            roles,
          },
        }));
      },
      setUserRole: (roleId) => {
        if (!roleId) return;

        const userRole = get().roles.roles.find((role) => role.id === roleId);

        set((state) => ({
          roles: {
            ...state.roles,
            userRole,
          },
        }));
      },
    },
  };
};
