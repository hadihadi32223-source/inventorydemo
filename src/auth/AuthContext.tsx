import { createContext, ReactNode, useContext, useMemo, useState } from 'react';
import {
  AuthUser,
  getCurrentUserFromStorage,
  hasRolePermission,
  setCurrentUserInStorage,
  validateLogin,
} from './authData';

type AuthContextValue = {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permissionCode?: string) => boolean;
};

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => getCurrentUserFromStorage());

  const value = useMemo<AuthContextValue>(() => ({
    user,
    isAuthenticated: Boolean(user),
    login: async (username: string, password: string) => {
      const loggedInUser = validateLogin(username, password);
      setCurrentUserInStorage(loggedInUser);
      setUser(loggedInUser);
    },
    logout: () => {
      setCurrentUserInStorage(null);
      setUser(null);
    },
    hasPermission: (permissionCode?: string) => {
      if (!permissionCode) return true;
      if (!user) return false;
      return hasRolePermission(user.role, permissionCode);
    },
  }), [user]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used inside AuthProvider');
  return context;
}
