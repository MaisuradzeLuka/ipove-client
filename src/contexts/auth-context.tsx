"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import * as authApi from "@/lib/api/auth";
import { ApiError } from "@/lib/api/client";
import { messages, translateApiError } from "@/lib/i18n";
import type { UpdateUserPayload, User } from "@/lib/auth/types";

type AuthContextValue = {
  user: User | null;
  isLoading: boolean;
  refreshUser: () => Promise<void>;
  signUp: (input: {
    email: string;
    password: string;
    confirmPassword: string;
  }) => Promise<string | null>;
  signIn: (email: string, password: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  updateProfile: (payload: UpdateUserPayload) => Promise<string | null>;
  uploadAvatar: (file: File) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return translateApiError(err.message);
  if (err instanceof Error) return translateApiError(err.message);
  return messages.auth.somethingWrong;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { user: me } = await authApi.getMe();
      setUser(me);
    } catch (err) {
      if (err instanceof ApiError && err.status === 401) {
        setUser(null);
        return;
      }
      throw err;
    }
  }, []);

  useEffect(() => {
    refreshUser()
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, [refreshUser]);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      try {
        await authApi.signUp(input);
        await refreshUser();
        return null;
      } catch (err) {
        return errorMessage(err);
      }
    },
    [refreshUser],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      try {
        await authApi.signIn({ email, password });
        await refreshUser();
        return null;
      } catch (err) {
        return errorMessage(err);
      }
    },
    [refreshUser],
  );

  const signOut = useCallback(async () => {
    try {
      await authApi.signOut();
    } finally {
      setUser(null);
    }
  }, []);

  const updateProfile = useCallback(async (payload: UpdateUserPayload) => {
    try {
      await authApi.updateUser(payload);
      await refreshUser();
      return null;
    } catch (err) {
      return errorMessage(err);
    }
  }, [refreshUser]);

  const uploadAvatar = useCallback(async (file: File) => {
    try {
      return await authApi.uploadImage(file);
    } catch (err) {
      return errorMessage(err);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      refreshUser,
      signUp,
      signIn,
      signOut,
      updateProfile,
      uploadAvatar,
    }),
    [
      user,
      isLoading,
      refreshUser,
      signUp,
      signIn,
      signOut,
      updateProfile,
      uploadAvatar,
    ],
  );

  return (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return ctx;
}
