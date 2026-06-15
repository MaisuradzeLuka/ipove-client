"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useMessages } from "@/contexts/locale-context";

type GoogleSignInButtonProps = {
  callbackURL?: string;
};

export function GoogleSignInButton({
  callbackURL = "/",
}: GoogleSignInButtonProps) {
  const messages = useMessages();
  const router = useRouter();
  const { signInWithGoogle, refreshUser } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleClick() {
    setError(null);
    setSubmitting(true);
    // signInWithGoogle triggers a full-page redirect to Google then back;
    // if it returns an error (no redirect happened), show it.
    const err = await signInWithGoogle(callbackURL);
    setSubmitting(false);
    if (err) {
      setError(err);
      return;
    }
    // If we reach here the redirect didn't happen (e.g. already signed in),
    // refresh auth state manually.
    await refreshUser();
    router.push(callbackURL);
    router.refresh();
  }

  return (
    <div className="space-y-3">
      {error ? (
        <div
          role="alert"
          className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
          {error}
        </div>
      ) : null}
      <button
        type="button"
        onClick={handleClick}
        disabled={submitting}
        className="flex w-full items-center justify-center gap-2 rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background-muted disabled:cursor-not-allowed disabled:opacity-60">
        <GoogleIcon />
        {submitting ? messages.auth.googleSubmitting : messages.auth.googleSignIn}
      </button>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg className="size-5" viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
