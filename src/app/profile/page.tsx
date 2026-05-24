"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { FormField } from "@/components/auth/form-field";
import { useAuth } from "@/contexts/auth-context";
import { messages } from "@/lib/i18n/messages";
import type { UserCategory } from "@/lib/auth/types";

const selectClass =
  "w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isLoading, updateProfile, uploadAvatar } = useAuth();

  const [name, setName] = useState("");
  const [lastname, setLastname] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [category, setCategory] = useState<UserCategory>("developer");
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
    setCategory(user.category ?? "developer");
    setAvatarUrl(user.avatar);
  }, [user]);

  if (isLoading || !user) {
    return (
      <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
        <p className="text-sm text-foreground-muted">{messages.profile.loading}</p>
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
      category,
      avatar: avatarUrl ?? undefined,
      examples: user.examples,
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

  return (
    <main className="mx-auto w-full max-w-lg flex-1 px-6 py-12">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">
        {messages.profile.title}
      </h1>
      <p className="mt-2 text-sm text-foreground-muted">
        {user.email} — {messages.profile.savedVia}{" "}
        <code className="text-foreground-accent">ipove-server</code>
      </p>

      <article className="mt-8 rounded-xl bg-background-surface p-6 shadow-sm ring-1 ring-border">
        <AvatarUpload
          user={user}
          previewUrl={avatarUrl}
          onPreviewChange={setAvatarUrl}
          onUpload={uploadAvatar}
        />

        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
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

          <div className="grid gap-4 sm:grid-cols-2">
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

          <FormField
            id="phone"
            label={messages.profile.phone}
            type="tel"
            required
            value={phoneNumber}
            onChange={(e) => setPhoneNumber(e.target.value)}
          />

          <FormField
            id="address"
            label={messages.profile.address}
            required
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <FormField
            id="city"
            label={messages.profile.city}
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
          />

          <div className="space-y-1.5">
            <label htmlFor="category" className="text-sm font-medium text-foreground">
              {messages.profile.category}
            </label>
            <select
              id="category"
              required
              value={category}
              onChange={(e) => setCategory(e.target.value as UserCategory)}
              className={selectClass}>
              <option value="developer">{messages.profile.categoryDeveloper}</option>
              <option value="handyman">{messages.profile.categoryHandyman}</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover active:bg-accent-active disabled:cursor-not-allowed disabled:opacity-60">
            {submitting ? messages.profile.submitting : messages.profile.submit}
          </button>
        </form>
      </article>

      <p className="mt-6 text-center text-sm text-foreground-muted">
        <Link
          href="/"
          className="text-foreground-accent hover:text-accent-hover">
          {messages.profile.backHome}
        </Link>
      </p>
    </main>
  );
}
