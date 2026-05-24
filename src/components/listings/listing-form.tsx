"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FormField } from "@/components/auth/form-field";
import { getCategories } from "@/lib/api/categories";
import { createListing, updateListing } from "@/lib/api/listings";
import type { CategoryGroup } from "@/lib/categories/types";
import { messages } from "@/lib/i18n/messages";
import type { Listing, ListingStatus } from "@/lib/listings/types";

const selectClass =
  "w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

const textareaClass =
  "w-full rounded-lg border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none placeholder:text-foreground-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

type ListingFormProps = {
  mode: "create" | "edit";
  listing?: Listing;
  defaultCity?: string;
};

function splitList(value: string): string[] {
  return value
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
}

export function ListingForm({ mode, listing, defaultCity }: ListingFormProps) {
  const router = useRouter();
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryId, setCategoryId] = useState(listing?.categoryId ?? "");
  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [city, setCity] = useState(listing?.city ?? defaultCity ?? "");
  const [experienceYears, setExperienceYears] = useState(
    listing?.experienceYears != null ? String(listing.experienceYears) : "",
  );
  const [hourlyRate, setHourlyRate] = useState(
    listing?.hourlyRate != null ? String(listing.hourlyRate) : "",
  );
  const [skills, setSkills] = useState(listing?.skills.join(", ") ?? "");
  const [examples, setExamples] = useState(listing?.examples.join("\n") ?? "");
  const [status, setStatus] = useState<ListingStatus>(
    listing?.status ?? "draft",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(({ groups: data }) => setGroups(data))
      .catch(() => setError(messages.listingForm.loadCategoriesFailed))
      .finally(() => setLoadingCategories(false));
  }, []);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const payload = {
      categoryId,
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      experienceYears: experienceYears
        ? Number.parseInt(experienceYears, 10)
        : undefined,
      hourlyRate: hourlyRate ? Number.parseInt(hourlyRate, 10) : undefined,
      skills: splitList(skills),
      examples: splitList(examples),
      status,
    };

    try {
      if (mode === "create") {
        const { listing: created } = await createListing(payload);
        router.push(`/listings/${created.listingId}`);
      } else if (listing) {
        await updateListing(listing.listingId, payload);
        router.push("/dashboard");
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : messages.auth.somethingWrong,
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error ? (
        <div role="alert" className="rounded-lg bg-error-soft px-4 py-3 text-sm text-error-foreground">
          {error}
        </div>
      ) : null}

      <div className="space-y-1.5">
        <label htmlFor="categoryId" className="text-sm font-medium text-foreground">
          {messages.listingForm.category}
        </label>
        <select
          id="categoryId"
          required
          disabled={loadingCategories}
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={selectClass}>
          <option value="">
            {loadingCategories
              ? messages.listingForm.loadingCategories
              : messages.listingForm.selectCategory}
          </option>
          {groups.map((group) => (
            <optgroup key={group.categoryId} label={group.nameKa}>
              {group.children.map((child) => (
                <option key={child.categoryId} value={child.categoryId}>
                  {child.icon} {child.nameKa}
                </option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <FormField
        id="title"
        label={messages.listingForm.title}
        required
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder={messages.listingForm.titlePlaceholder}
      />

      <div className="space-y-1.5">
        <label htmlFor="description" className="text-sm font-medium text-foreground">
          {messages.listingForm.description}
        </label>
        <textarea
          id="description"
          required
          rows={5}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={messages.listingForm.descriptionPlaceholder}
          className={textareaClass}
        />
      </div>

      <FormField
        id="city"
        label={messages.listingForm.city}
        required
        value={city}
        onChange={(e) => setCity(e.target.value)}
      />

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          id="experienceYears"
          label={messages.listingForm.experience}
          type="number"
          min={0}
          max={80}
          value={experienceYears}
          onChange={(e) => setExperienceYears(e.target.value)}
        />
        <FormField
          id="hourlyRate"
          label={messages.listingForm.hourlyRate}
          type="number"
          min={0}
          value={hourlyRate}
          onChange={(e) => setHourlyRate(e.target.value)}
        />
      </div>

      <FormField
        id="skills"
        label={messages.listingForm.skills}
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder={messages.listingForm.skillsPlaceholder}
        hint={messages.listingForm.skillsHint}
      />

      <div className="space-y-1.5">
        <label htmlFor="examples" className="text-sm font-medium text-foreground">
          {messages.listingForm.portfolio}
        </label>
        <textarea
          id="examples"
          rows={3}
          value={examples}
          onChange={(e) => setExamples(e.target.value)}
          placeholder={messages.listingForm.portfolioPlaceholder}
          className={textareaClass}
        />
        <p className="text-xs text-foreground-subtle">
          {messages.listingForm.portfolioHint}
        </p>
      </div>

      <div className="space-y-1.5">
        <label htmlFor="status" className="text-sm font-medium text-foreground">
          {messages.listingForm.status}
        </label>
        <select
          id="status"
          value={status}
          onChange={(e) => setStatus(e.target.value as ListingStatus)}
          className={selectClass}>
          <option value="draft">{messages.listingForm.statusDraft}</option>
          <option value="active">{messages.listingForm.statusActive}</option>
          <option value="archived">{messages.listingForm.statusArchived}</option>
        </select>
        <p className="text-xs text-foreground-subtle">
          {messages.listingForm.statusHint}
        </p>
      </div>

      <button
        type="submit"
        disabled={submitting || loadingCategories}
        className="w-full rounded-lg bg-accent px-4 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
        {submitting
          ? messages.listingForm.submitting
          : mode === "create"
            ? messages.listingForm.createSubmit
            : messages.listingForm.editSubmit}
      </button>
    </form>
  );
}
