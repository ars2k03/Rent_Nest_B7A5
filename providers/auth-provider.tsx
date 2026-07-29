"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "@/lib/services";
import {
  clearAuthCookies,
  getToken,
  setAuthCookies,
} from "@/lib/auth";
import type { User, UserRole } from "@/lib/types";

interface AuthContextValue {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const login = (nextToken: string, nextUser: User) => {
    setAuthCookies(nextToken, nextUser.role);
    setToken(nextToken);
    setUser(nextUser);
  };

  const logout = () => {
    clearAuthCookies();
    setToken(null);
    setUser(null);
  };

  const refreshUser = async () => {
    const storedToken = getToken();
    if (!storedToken) {
      setUser(null);
      setToken(null);
      return;
    }

    const profile = await authService.me(storedToken);
    setToken(storedToken);
    setUser(profile);
    setAuthCookies(storedToken, profile.role as UserRole);
  };

  useEffect(() => {
    const bootstrap = async () => {
      try {
        await refreshUser();
      } catch {
        clearAuthCookies();
        setUser(null);
        setToken(null);
      } finally {
        setIsLoading(false);
      }
    };

    void bootstrap();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, token, isLoading, login, logout, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
