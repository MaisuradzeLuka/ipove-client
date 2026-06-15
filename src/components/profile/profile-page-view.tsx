"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import {
  HiOutlineArrowTopRightOnSquare,
  HiOutlineMapPin,
  HiOutlinePlus,
  HiOutlineSquares2X2,
} from "react-icons/hi2";
import { AvatarUpload } from "@/components/auth/avatar-upload";
import { FormField } from "@/components/auth/form-field";
import { ListingCard } from "@/components/home/listing-card";
import { ChangePasswordLink } from "@/components/profile/change-password-link";
import { ListingGridSkeleton, ProfilePageSkeleton } from "@/components/skeletons";
import { useAuth } from "@/contexts/auth-context";
import { getMyListings } from "@/lib/api/listings";
import { userDisplayName } from "@/lib/auth/display";
import type { User } from "@/lib/auth/types";
import { useMessages } from "@/contexts/locale-context";
import { formatPhoneDisplay } from "@/lib/listings/contact";
import type { Listing } from "@/lib/listings/types";
import { getProfileCompleteness } from "@/lib/profile/completeness";
import {
  formatMemberSince,
  publicUserProfilePath,
} from "@/lib/users/types";

export function ProfilePageView() {
  const messages = useMessages();
  const missingLabels = useMemo(
    () =>
      ({
        name: messages.profile.missingName,
        lastname: messages.profile.missingLastname,
        phone: messages.profile.missingPhone,
        city: messages.profile.missingCity,
        address: messages.profile.missingAddress,
        avatar: messages.profile.missingAvatar,
      }) as const,
    [messages],
  );
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
  const [listings, setListings] = useState<Listing[]>([]);
  const [loadingListings, setLoadingListings] = useState(true);

  const loadListings = useCallback(async () => {
    setLoadingListings(true);
    try {
      const data = await getMyListings();
      setListings(
        data.listings.filter((listing) => listing.status === "active"),
      );
    } catch {
      setListings([]);
    } finally {
      setLoadingListings(false);
    }
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/sign-in?next=/profile");
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
    void loadListings();
  }, [user, loadListings]);

  if (isLoading || !user) {
    return <ProfilePageSkeleton />;
  }

  const displayName =
    [name, lastname].filter(Boolean).join(" ").trim() || userDisplayName(user);
  const completeness = getProfileCompleteness(user, {
    name,
    lastname,
    phoneNumber,
    city,
    address,
    avatarUrl,
  });
  const memberSince = formatMemberSince(user.createdAt);
  const savedPhone =
    user.phoneNumber != null ? formatPhoneDisplay(user.phoneNumber) : null;
  const previewListings = listings.slice(0, 3);

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
    const err = await updateProfile(
      buildUpdatePayload(user, {
        name,
        lastname,
        phone,
        address,
        city,
        avatarUrl,
      }),
    );
    setSubmitting(false);

    if (err) {
      setError(err);
      return;
    }
    setSuccess(messages.profile.saved);
  }

  return (
    <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-8 sm:py-10">
      <header className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
          {messages.profile.title}
        </h1>
        <p className="mt-2 max-w-2xl text-sm text-foreground-muted sm:text-base">
          {messages.profile.subtitle}
        </p>
      </header>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,320px)_1fr] lg:items-start">
        <aside className="space-y-4 lg:sticky lg:top-24">
          <section className="overflow-hidden rounded-2xl border border-border bg-gradient-to-br from-accent-soft/70 via-background-surface to-background-surface p-6 shadow-sm">
            <AvatarUpload
              user={user}
              displayName={displayName}
              previewUrl={avatarUrl}
              onPreviewChange={setAvatarUrl}
              onUpload={uploadAvatar}
            />
            <ul className="mt-4 space-y-2 text-sm text-foreground-muted">
              <li className="truncate">{user.email}</li>
              {city ? (
                <li className="inline-flex items-center gap-1.5">
                  <HiOutlineMapPin className="size-4 shrink-0" aria-hidden />
                  {city}
                </li>
              ) : null}
              {savedPhone ? <li>{savedPhone}</li> : null}
              <li>{messages.publicProfile.memberSince(memberSince)}</li>
              <li>{messages.profile.activeListings(listings.length)}</li>
            </ul>
            <Link
              href={publicUserProfilePath(user.userId)}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-border bg-background-surface px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent/40 hover:bg-accent-soft/40">
              {messages.profile.viewPublicProfile}
              <HiOutlineArrowTopRightOnSquare className="size-4" aria-hidden />
            </Link>
          </section>

          <ProfileCompletenessCard completeness={completeness} />

          <div className="grid grid-cols-2 gap-3">
            <Link
              href="/dashboard"
              className="flex flex-col gap-2 rounded-2xl border border-border bg-background-surface p-4 shadow-xs transition-colors hover:border-accent/40 hover:bg-accent-soft/30">
              <HiOutlineSquares2X2
                className="size-5 text-foreground-accent"
                aria-hidden
              />
              <span className="text-sm font-semibold text-foreground">
                {messages.profile.myListings}
              </span>
            </Link>
            <Link
              href="/dashboard/listings/new"
              className="flex flex-col gap-2 rounded-2xl border border-accent/30 bg-accent-soft/50 p-4 shadow-xs transition-colors hover:border-accent/50">
             
              <span className="text-sm font-semibold text-foreground">
                {messages.profile.addListing}
              </span>
            </Link>
          </div>
        </aside>

        <div className="space-y-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {error ? (
              <div
                role="alert"
                className="rounded-xl bg-error-soft px-4 py-3 text-sm text-error-foreground">
                {error}
              </div>
            ) : null}
            {success ? (
              <div
                role="status"
                className="rounded-xl bg-success-soft px-4 py-3 text-sm text-success-foreground">
                {success}
              </div>
            ) : null}

            <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">
                {messages.profile.personalSection}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
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
              <div className="mt-5">
                <FormField
                  id="email"
                  label={messages.profile.email}
                  value={user.email}
                  readOnly
                  disabled
                  className="bg-background-muted text-foreground-muted"
                />
              </div>
            </section>

            <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
              <h2 className="text-lg font-semibold text-foreground">
                {messages.profile.contactSection}
              </h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <FormField
                  id="phone"
                  label={messages.profile.phone}
                  type="tel"
                  required
                  hint={messages.profile.phoneHint}
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
              <div className="mt-5">
                <FormField
                  id="address"
                  label={messages.profile.address}
                  required
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting}
                  className="inline-flex min-w-36 items-center justify-center rounded-xl bg-accent px-5 py-2.5 text-sm font-semibold text-foreground-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
                  {submitting
                    ? messages.profile.submitting
                    : messages.profile.submit}
                </button>
              </div>
            </section>
          </form>

          <section className="overflow-hidden rounded-2xl border border-border bg-background-surface shadow-sm">
            <div className="border-b border-border px-6 py-4">
              <h2 className="text-lg font-semibold text-foreground">
                {messages.profile.securitySection}
              </h2>
            </div>
            <ChangePasswordLink />
          </section>

          <section className="rounded-2xl border border-border bg-background-surface p-6 shadow-sm">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <h2 className="text-lg font-semibold text-foreground">
                  {messages.profile.listingsPreview}
                </h2>
                <p className="mt-1 text-sm text-foreground-muted">
                  {messages.profile.activeListings(listings.length)}
                </p>
              </div>
              <Link
                href="/dashboard"
                className="text-sm font-medium text-foreground-accent transition-colors hover:text-accent-hover">
                {messages.profile.manageListings}
              </Link>
            </div>

            {loadingListings ? (
              <div className="mt-6">
                <ListingGridSkeleton count={3} showHeader={false} />
              </div>
            ) : previewListings.length === 0 ? (
              <div className="mt-6 rounded-xl border border-dashed border-border bg-background-muted/40 px-6 py-10 text-center">
                <p className="text-sm text-foreground-muted">
                  {messages.profile.listingsPreviewEmpty}
                </p>
                <Link
                  href="/dashboard/listings/new"
                  className="mt-4 inline-flex rounded-xl bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover">
                  {messages.profile.addListing}
                </Link>
              </div>
            ) : (
              <ul className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
                {previewListings.map((listing) => (
                  <li key={listing.listingId} className="h-full">
                    <ListingCard listing={listing} />
                  </li>
                ))}
              </ul>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

function ProfileCompletenessCard({
  completeness,
}: {
  completeness: ReturnType<typeof getProfileCompleteness>;
}) {
  const messages = useMessages();
  const missingLabels = useMemo(
    () =>
      ({
        name: messages.profile.missingName,
        lastname: messages.profile.missingLastname,
        phone: messages.profile.missingPhone,
        city: messages.profile.missingCity,
        address: messages.profile.missingAddress,
        avatar: messages.profile.missingAvatar,
      }) as const,
    [messages],
  );

  if (completeness.percent >= 100) return null;

  return (
    <section className="rounded-2xl border border-border bg-background-surface p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-sm font-semibold text-foreground">
          {messages.profile.completenessTitle}
        </h2>
        <span className="text-sm font-bold text-foreground-accent">
          {messages.profile.completenessLabel(completeness.percent)}
        </span>
      </div>
      <div className="mt-3 h-2 overflow-hidden rounded-full bg-background-muted">
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${completeness.percent}%` }}
        />
      </div>
      <p className="mt-2 text-xs text-foreground-muted">
        {messages.profile.completenessHint}
      </p>
      {completeness.missing.length > 0 ? (
        <ul className="mt-3 space-y-1.5">
          {completeness.missing.map((key) => (
            <li
              key={key}
              className="text-xs text-foreground-muted before:mr-2 before:text-foreground-accent before:content-['•']">
              {missingLabels[key]}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}

function buildUpdatePayload(
  user: User,
  data: {
    name: string;
    lastname: string;
    phone: number;
    address: string;
    city: string;
    avatarUrl: string | null;
  },
) {
  return {
    userId: user.userId,
    name: data.name.trim(),
    lastname: data.lastname.trim(),
    phoneNumber: data.phone,
    address: data.address.trim(),
    city: data.city.trim(),
    avatar: data.avatarUrl ?? undefined,
    createdAt: user.createdAt,
    updatedAt: new Date().toISOString(),
    isComplete: true,
  };
}