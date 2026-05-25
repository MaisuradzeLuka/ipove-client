"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { FormField } from "@/components/auth/form-field";
import { ChangePasswordLink } from "@/components/profile/change-password-link";
import { useAuth } from "@/contexts/auth-context";
import { userDisplayName } from "@/lib/auth/display";
import { messages } from "@/lib/i18n/messages";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, uploadAvatar } = useAuth();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in");
    }
  }, [isLoading, user, router]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
    setLastname(user.lastname ?? "");
    setPhoneNumber(user.phoneNumber != null ? String(user.phoneNumber) : "");
    setAddress(user.address ?? "");
    setCity(user.city ?? "");
    setAvatarUrl(user.avatar);
  }, [user]);

  if (isLoading || !user) {
    return (
      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-10 sm:px-6 sm:py-12">
        <p className="text-sm text-foreground-muted">
          {messages.profile.loading}
        </p>
      </main>
    );
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!user) return;
    setError(null);
    setSuccess(null);

    const phone = Number(phoneNumber);
    if (!Number.isFinite(phone)) {
      setError(messages.profile.phoneInvalid);
      return;
    }

    setSubmitting(true);
    const err = await updateProfile({
      userId: user.userId,
      name: name.trim(),
      lastname: lastname.trim(),
      phoneNumber: phone,
      address: address.trim(),
      city: city.trim(),
      avatar: avatarUrl ?? undefined,
      createdAt: user.createdAt,
      updatedAt: new Date().toISOString(),
      isComplete: true,
    });
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }
    setSuccess(messages.profile.saved);
  }

  const displayName =
    [name, lastname].filter(Boolean).join(" ").trim() || userDisplayName(user);

  return (
    <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 sm:py-12">
      <header className="border-b border-border pb-6">
        <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
          {messages.profile.title}
        </h1>
      </header>

      <article className="mt-8 rounded-xl bg-background-surface p-5 shadow-sm ring-1 ring-border sm:p-6 lg:p-8">
        <div className="border-b border-border pb-6">
          <AvatarUpload
            user={user}
            displayName={displayName}
            previewUrl={avatarUrl}
            onPreviewChange={setAvatarUrl}
            onUpload={uploadAvatar}
          />
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5 lg:mt-8">
          {error && (
            <div
              role="alert"
              className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground"
            >
              {error}
            </div>
          )}
          {success && (
            <div
              role="status"
              className="rounded-lg bg-success-soft px-4 py-3 text-sm text-success-foreground"
            >
              {success}
            </div>
          )}

          <div className="grid gap-5 sm:grid-cols-2">
            <FormField
              id="name"
              label={messages.profile.firstName}
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <FormField
              id="lastname"
              label={messages.profile.lastName}
              required
              value={lastname}
              onChange={(e) => setLastname(e.target.value)}
            />
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <FormField
              id="phone"
              label={messages.profile.phone}
              type="tel"
              required
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <FormField
              id="city"
              label={messages.profile.city}
              required
              value={city}
              onChange={(e) => setCity(e.target.value)}
            />
          </div>

          <FormField
            id="address"
            label={messages.profile.address}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:justify-end mb-4">
            <button
              type="submit"
              disabled={submitting}
              className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto sm:min-w-44"
            >
              {submitting
                ? messages.profile.submitting
                : messages.profile.submit}
            </button>
          </div>
        </form>

        <ChangePasswordLink />
      </article>
    </main>
  );
}
