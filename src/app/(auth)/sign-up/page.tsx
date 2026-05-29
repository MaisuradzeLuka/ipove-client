"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { GoogleSignInButton } from "@/components/auth/google-sign-in-button";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export default function SignUpPage() {
  const router = useRouter();
  const { signUp } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);

    if (password !== confirmPassword) {
      setError(messages.auth.passwordsMismatch);
      return;
    }

    setSubmitting(true);
    const err = await signUp({
      email: email.trim(),
      password,
      confirmPassword,
    });
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    router.push(
      `/check-email?email=${encodeURIComponent(email.trim())}`,
    );
    router.refresh();
  }

  return (
    <AuthCard
      title={messages.signUp.title}
      subtitle={messages.signUp.subtitle}
      footer={
        <>
          {messages.signUp.hasAccount}{" "}
          <Link
            href="/sign-in"
            className="font-medium text-foreground-accent hover:text-accent-hover">
            {messages.signUp.signInLink}
          </Link>
        </>
      }>
      <div className="space-y-4">
        <GoogleSignInButton callbackURL="/profile" />

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t border-border" />
          </div>
          <p className="relative flex justify-center text-xs uppercase tracking-wide text-foreground-muted">
            <span className="bg-background-surface px-2">
              {messages.auth.orContinueWith}
            </span>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
              {error}
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
          <PasswordField
            id="password"
            label={messages.auth.password}
            autoComplete="new-password"
            required
            minLength={8}
            hint={messages.auth.passwordHint}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <PasswordField
            id="confirmPassword"
            label={messages.auth.confirmPassword}
            autoComplete="new-password"
            required
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? messages.signUp.submitting : messages.signUp.submit}
          </button>
        </form>
      </div>
    </AuthCard>
  );
}
