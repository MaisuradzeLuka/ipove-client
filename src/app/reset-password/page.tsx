"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, Suspense, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { PasswordField } from "@/components/auth/password-field";
import { authClient } from "@/lib/auth-client";
import { messages, translateApiError } from "@/lib/i18n";

export default function ResetPasswordPage() {
  return (
    <Suspense>
      <ResetPasswordForm />
    </Suspense>
  );
}

function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const tokenError = searchParams.get("error");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(
    tokenError ? messages.resetPassword.invalidToken : null,
  );
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!token) {
      setError(messages.resetPassword.invalidToken);
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(messages.auth.passwordsMismatch);
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await authClient.resetPassword({
      newPassword,
      token,
    });
    setSubmitting(false);

    if (resetError) {
      setError(translateApiError(resetError.message ?? ""));
      return;
    }

    setSuccess(messages.resetPassword.success);
    setTimeout(() => {
      router.push("/sign-in");
    }, 2000);
  }

  return (
    <AuthCard
      title={messages.resetPassword.title}
      subtitle={messages.resetPassword.subtitle}
      footer={
        <Link
          href="/sign-in"
          className="font-medium text-foreground-accent hover:text-accent-hover">
          {messages.resetPassword.backToSignIn}
        </Link>
      }>
      <form onSubmit={handleSubmit} className="space-y-4">
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
          id="newPassword"
          label={messages.profile.newPassword}
          autoComplete="new-password"
          required
          minLength={8}
          hint={messages.auth.passwordHint}
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          disabled={!token}
        />
        <PasswordField
          id="confirmPassword"
          label={messages.auth.confirmPassword}
          autoComplete="new-password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          disabled={!token}
        />
        <button
          type="submit"
          disabled={submitting || !token}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60">
          {submitting
            ? messages.resetPassword.submitting
            : messages.resetPassword.submit}
        </button>
      </form>
    </AuthCard>
  );
}
