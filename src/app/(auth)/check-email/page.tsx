"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/contexts/auth-context";
import { useMessages } from "@/contexts/locale-context";

export default function CheckEmailPage() {
  return (
    <Suspense>
      <CheckEmailContent />
    </Suspense>
  );
}

function CheckEmailContent() {
  const messages = useMessages();
  const searchParams = useSearchParams();
  const email = searchParams.get("email")?.trim() ?? "";
  const { resendVerificationEmail } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleResend() {
    if (!email) return;
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    const err = await resendVerificationEmail(email);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(messages.checkEmail.resent);
  }

  return (
    <AuthCard
      title={messages.checkEmail.title}
      subtitle={messages.checkEmail.subtitle}
      footer={
        <Link
          href="/sign-in"
          className="font-medium text-foreground-accent hover:text-accent-hover">
          {messages.checkEmail.backToSignIn}
        </Link>
      }>
      <div className="space-y-4">
        {email && (
          <p className="text-sm text-foreground-muted">
            {messages.checkEmail.sentTo}{" "}
            <span className="font-medium text-foreground">{email}</span>
          </p>
        )}
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
        {email && (
          <button
            type="button"
            onClick={handleResend}
            disabled={submitting}
            className="w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60">
            {submitting
              ? messages.checkEmail.resending
              : messages.checkEmail.resend}
          </button>
        )}
      </div>
    </AuthCard>
  );
}
