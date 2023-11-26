import { FC, ReactNode, createContext, useContext } from "react";

import { AccessUser, useUserData } from "../hooks/use-user-data";

interface UserContextProps {
  user?: AccessUser;
  loading: boolean;
  error?: Error | null;
}

const UserContext = createContext<UserContextProps | null>(null);

export const UserContextProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { user, loading, error } = useUserData();

  if (loading) {
    return (
      <UserContext.Provider value={{ loading }}>
        {children}
      </UserContext.Provider>
    );
  }

  if (error) {
    return (
      <UserContext.Provider value={{ user: null, loading, error }}>
        {children}
      </UserContext.Provider>
    );
  }

  const value = {
    user,
    loading,
    error,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserContextProvider");
  }

  return context;
};
