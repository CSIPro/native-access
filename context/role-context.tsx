import { FC, ReactNode, createContext, useContext } from "react";

import { Role, useRoles } from "../hooks/use-roles";

interface RoleContextProps {
  status?: "loading" | "error" | "success";
  roles?: Role[];
}

export const RoleContext = createContext<RoleContextProps>({});

export const RoleProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { status: rolesStatus, data: rolesData } = useRoles();

  if (rolesStatus === "loading") {
    return (
      <RoleContext.Provider value={{ status: "loading" }}>
        {children}
      </RoleContext.Provider>
    );
  }

  if (rolesStatus === "error") {
    return (
      <RoleContext.Provider value={{ status: "error" }}>
        {children}
      </RoleContext.Provider>
    );
  }

  if (!rolesData) {
    return (
      <RoleContext.Provider value={{ status: "error" }}>
        {children}
      </RoleContext.Provider>
    );
  }

  const providerValue = {
    roles: rolesData,
  };

  return (
    <RoleContext.Provider value={providerValue}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRoleContext = () => {
  const context = useContext(RoleContext);

  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }

  return context;
};
