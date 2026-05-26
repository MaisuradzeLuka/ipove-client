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
import { authClient } from "@/lib/auth-client";
import { messages, translateApiError } from "@/lib/i18n";
import type { UpdateUserPayload, User } from "@/lib/auth/types";
import { verifyEmailCallbackURL } from "@/lib/auth/verify-email";

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
  signInWithGoogle: (callbackURL?: string) => Promise<string | null>;
  signOut: () => Promise<void>;
  requestPasswordReset: (email: string) => Promise<string | null>;
  resendVerificationEmail: (email: string) => Promise<string | null>;
  updateProfile: (payload: UpdateUserPayload) => Promise<string | null>;
  uploadAvatar: (file: File) => Promise<string | null>;
};

const AuthContext = createContext<AuthContextValue | null>(null);

function errorMessage(err: unknown): string {
  if (err instanceof ApiError) return translateApiError(err.message);
  if (err instanceof Error) return translateApiError(err.message);
  return messages.auth.somethingWrong;
}

function authClientErrorMessage(
  error: { message?: string } | null | undefined,
): string | null {
  if (!error?.message) return messages.auth.somethingWrong;
  return translateApiError(error.message);
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

  // Re-check session when the tab regains focus — handles OAuth redirect return.
  useEffect(() => {
    function handleFocus() {
      refreshUser().catch(() => setUser(null));
    }
    window.addEventListener("focus", handleFocus);
    return () => window.removeEventListener("focus", handleFocus);
  }, [refreshUser]);

  const signUp = useCallback(
    async (input: {
      email: string;
      password: string;
      confirmPassword: string;
    }) => {
      if (input.password !== input.confirmPassword) {
        return messages.auth.passwordsMismatch;
      }

      const email = input.email.trim();
      const { error } = await authClient.signUp.email({
        email,
        password: input.password,
        name: email.split("@")[0] || "User",
        callbackURL: verifyEmailCallbackURL(),
      });

      if (error) return authClientErrorMessage(error);

      return null;
    },
    [refreshUser],
  );

  const signIn = useCallback(
    async (email: string, password: string) => {
      const { error } = await authClient.signIn.email({
        email: email.trim(),
        password,
      });

      if (error) return authClientErrorMessage(error);

      await refreshUser();
      return null;
    },
    [refreshUser],
  );

  const signInWithGoogle = useCallback(async (callbackURL = "/") => {
    const origin =
      typeof window !== "undefined" ? window.location.origin : "";
    const absoluteCallback = callbackURL.startsWith("http")
      ? callbackURL
      : `${origin}${callbackURL}`;
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: absoluteCallback,
    });

    if (error) return authClientErrorMessage(error);
    return null;
  }, []);

  const signOut = useCallback(async () => {
    try {
      await authClient.signOut();
    } finally {
      setUser(null);
    }
  }, []);

  const resendVerificationEmail = useCallback(async (email: string) => {
    const { error } = await authClient.sendVerificationEmail({
      email: email.trim(),
      callbackURL: verifyEmailCallbackURL(),
    });

    if (error) return authClientErrorMessage(error);
    return null;
  }, []);

  const requestPasswordReset = useCallback(async (email: string) => {
    const frontendUrl =
      typeof window !== "undefined" ? window.location.origin : "";
    const { error } = await authClient.requestPasswordReset({
      email: email.trim(),
      redirectTo: `${frontendUrl}/reset-password`,
    });

    if (error) return authClientErrorMessage(error);
    return null;
  }, []);

  const updateProfile = useCallback(
    async (payload: UpdateUserPayload) => {
      try {
        await authApi.updateUser(payload);
        await refreshUser();
        return null;
      } catch (err) {
        return errorMessage(err);
      }
    },
    [refreshUser],
  );

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
      signInWithGoogle,
      signOut,
      requestPasswordReset,
      resendVerificationEmail,
      updateProfile,
      uploadAvatar,
    }),
    [
      user,
      isLoading,
      refreshUser,
      signUp,
      signIn,
      signInWithGoogle,
      signOut,
      requestPasswordReset,
      resendVerificationEmail,
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
