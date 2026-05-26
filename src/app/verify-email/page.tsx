"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { AuthCard } from "@/components/auth/auth-card";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";

export default function VerifyEmailPage() {
  return (
    <Suspense>
      <VerifyEmailResult />
    </Suspense>
  );
}

function VerifyEmailResult() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { refreshUser } = useAuth();
  const tokenError = searchParams.get("error");
  const [ready, setReady] = useState(false);

  const success = !tokenError;

  useEffect(() => {
    if (!success) {
      setReady(true);
      return;
    }

    refreshUser()
      .catch(() => undefined)
      .finally(() => setReady(true));
  }, [success, refreshUser]);

  return (
    <AuthCard
      title={messages.verifyEmail.title}
      subtitle={
        success ? messages.verifyEmail.success : messages.verifyEmail.invalidToken
      }
      footer={
        success ? (
          <button
            type="button"
            disabled={!ready}
            onClick={() => router.push("/profile")}
            className="font-medium text-foreground-accent hover:text-accent-hover disabled:opacity-60">
            {messages.verifyEmail.continueToProfile}
          </button>
        ) : (
          <Link
            href="/sign-in"
            className="font-medium text-foreground-accent hover:text-accent-hover">
            {messages.verifyEmail.backToSignIn}
          </Link>
        )
      }>
      {success && (
        <div
          role="status"
          className="rounded-lg bg-success-soft px-4 py-3 text-sm text-success-foreground">
          {messages.verifyEmail.success}
        </div>
      )}
      {tokenError && (
        <div
          role="alert"
          className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
          {messages.verifyEmail.invalidToken}
        </div>
      )}
    </AuthCard>
  );
}
