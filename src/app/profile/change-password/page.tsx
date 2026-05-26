"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { HiOutlineArrowLeft } from "react-icons/hi2";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/contexts/auth-context";
import { authClient } from "@/lib/auth-client";
import { messages, translateApiError } from "@/lib/i18n";

export default function ChangePasswordPage() {
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in?next=/profile/change-password");
    }
  }, [isLoading, user, router]);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (newPassword !== confirmPassword) {
      setError(messages.auth.passwordsMismatch);
      return;
    }

    setSubmitting(true);
    const { error: changeError } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });
    setSubmitting(false);

    if (changeError) {
      setError(translateApiError(changeError.message ?? ""));
      return;
    }

    setSuccess(messages.profile.changePasswordSaved);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  }

  if (isLoading || !user) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-sm text-foreground-muted">{messages.profile.loading}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <Link
        href="/profile"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-foreground-accent transition-colors hover:text-accent-hover">
        <HiOutlineArrowLeft className="size-4" aria-hidden />
        {messages.profile.backToProfile}
      </Link>

      <header className="mt-6 border-b border-border pb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {messages.profile.changePasswordPageTitle}
        </h1>
        <p className="mt-2 text-sm text-foreground-muted">
          {messages.profile.changePasswordPageSubtitle}
        </p>
      </header>

      <article className="mt-8 rounded-xl bg-background-surface p-5 shadow-sm ring-1 ring-border sm:p-6 lg:p-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="rounded-lg bg-success-soft px-4 py-3 text-sm text-success-foreground">
              {success}
            </div>
          )}

          <PasswordField
            id="currentPassword"
            label={messages.profile.currentPassword}
            autoComplete="current-password"
            required
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <PasswordField
            id="newPassword"
            label={messages.profile.newPassword}
            autoComplete="new-password"
            required
            hint={messages.auth.passwordHint}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <PasswordField
            id="confirmPassword"
            label={messages.auth.confirmPassword}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-44">
              {submitting
                ? messages.profile.changePasswordSubmitting
                : messages.profile.changePasswordSubmit}
            </button>
          </div>
        </form>
      </article>
    </main>
  );
}
