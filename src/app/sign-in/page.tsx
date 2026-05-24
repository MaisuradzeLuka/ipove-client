"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { FormField } from "@/components/auth/form-field";
import { PasswordField } from "@/components/auth/password-field";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export default function SignInPage() {
  const router = useRouter();
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    const err = await signIn(email.trim(), password);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    router.push("/");
    router.refresh();
  }

  return (
    <AuthCard
      title={messages.signIn.title}
      subtitle={messages.signIn.subtitle}
      footer={
        <>
          {messages.signIn.noAccount}{" "}
          <Link
            href="/sign-up"
            className="font-medium text-foreground-accent hover:text-accent-hover">
            {messages.signIn.signUpLink}
          </Link>
        </>
      }>
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
          autoComplete="current-password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60">
          {submitting ? messages.signIn.submitting : messages.signIn.submit}
        </button>
      </form>
    </AuthCard>
  );
}
