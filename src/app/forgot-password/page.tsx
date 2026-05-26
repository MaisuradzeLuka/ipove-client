"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export default function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSubmitting(true);
    const err = await requestPasswordReset(email.trim());
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    setSuccess(messages.auth.resetEmailSent);
  }

  return (
    <AuthCard
      title={messages.forgotPassword.title}
      subtitle={messages.forgotPassword.subtitle}
      footer={
        <Link
          href="/sign-in"
          className="font-medium text-foreground-accent hover:text-accent-hover">
          {messages.forgotPassword.backToSignIn}
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
        <FormField
          id="email"
          label={messages.auth.email}
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60">
          {submitting
            ? messages.forgotPassword.submitting
            : messages.forgotPassword.submit}
        </button>
      </form>
    </AuthCard>
  );
}
