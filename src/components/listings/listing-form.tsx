"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi2";
import { FormField } from "@/components/auth/form-field";
import { ListingPhotosUpload } from "@/components/listings/listing-photos-upload";
import { getCategories } from "@/lib/api/categories";
import { createListing, updateListing } from "@/lib/api/listings";
import type { CategoryGroup } from "@/lib/categories/types";
import { getCategoryHints } from "@/lib/listings/category-hints";
import { ListingLocationPicker } from "@/components/listings/listing-location-picker";
import { GEORGIAN_CITIES } from "@/lib/listings/filters";
import {
  hasMapLocation,
  type MapCoordinates,
} from "@/lib/listings/coordinates";
import { useCategoryName, useMessages } from "@/contexts/locale-context";
import type {
  CompensationType,
  Listing,
  ListingStatus,
  WorkMode,
} from "@/lib/listings/types";

const selectClass =
  "w-full rounded-xl border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

const textareaClass =
  "w-full rounded-xl border border-border bg-background-surface px-4 py-2.5 text-foreground outline-none placeholder:text-foreground-subtle focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset";

const TOTAL_STEPS = 3;

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

function StepProgress({ step }: { step: number }) {
  const messages = useMessages();
  const labels = [
    messages.listingForm.step1Label,
    messages.listingForm.step2Label,
    messages.listingForm.step3Label,
  ];

  return (
    <div className="mb-8">
      <div className="flex items-center justify-between gap-2">
        {labels.map((label, index) => {
          const stepNum = index + 1;
          const isActive = step === stepNum;
          const isDone = step > stepNum;

          return (
            <div key={label} className="flex flex-1 flex-col items-center gap-2">
              <div
                className={`flex size-9 items-center justify-center rounded-full text-sm font-semibold transition-colors ${
                  isDone
                    ? "bg-accent text-foreground-on-accent"
                    : isActive
                      ? "bg-accent text-foreground-on-accent ring-4 ring-accent/20"
                      : "bg-background-muted text-foreground-muted"
                }`}>
                {isDone ? (
                  <HiOutlineCheck className="size-4" aria-hidden />
                ) : (
                  stepNum
                )}
              </div>
              <span
                className={`hidden text-center text-xs font-medium sm:block ${
                  isActive ? "text-foreground" : "text-foreground-muted"
                }`}>
                {label}
              </span>
            </div>
          );
        })}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-background-muted">
        <div
          className="h-full rounded-full bg-accent transition-all duration-300"
          style={{ width: `${((step - 1) / (TOTAL_STEPS - 1)) * 100}%` }}
        />
      </div>
      <p className="mt-2 text-center text-xs text-foreground-muted">
        {messages.listingForm.stepProgress(step, TOTAL_STEPS)}
      </p>
    </div>
  );
}

function RadioButtonGroup<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: T;
  options: { value: T; label: string }[];
  onChange: (value: T) => void;
}) {
  return (
    <fieldset className="space-y-2">
      <legend className="text-sm font-medium text-foreground">{label}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => {
          const selected = value === option.value;
          return (
            <label
              key={option.value}
              className={`cursor-pointer rounded-xl border px-4 py-2.5 text-sm font-medium transition-colors ${
                selected
                  ? "border-accent bg-accent-soft text-foreground-accent"
                  : "border-border bg-background-surface text-foreground-muted hover:border-accent/40"
              }`}>
              <input
                type="radio"
                name={label}
                value={option.value}
                checked={selected}
                onChange={() => onChange(option.value)}
                className="sr-only"
              />
              {option.label}
            </label>
          );
        })}
      </div>
    </fieldset>
  );
}

export function ListingForm({ mode, listing, defaultCity }: ListingFormProps) {
  const messages = useMessages();
  const categoryName = useCategoryName();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [groups, setGroups] = useState<CategoryGroup[]>([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [categoryId, setCategoryId] = useState(listing?.categoryId ?? "");
  const [photos, setPhotos] = useState<string[]>(listing?.examples ?? []);
  const [title, setTitle] = useState(listing?.title ?? "");
  const [description, setDescription] = useState(listing?.description ?? "");
  const [city, setCity] = useState(listing?.city ?? defaultCity ?? "");
  const [location, setLocation] = useState<MapCoordinates | null>(
    listing && hasMapLocation(listing)
      ? { latitude: listing.latitude, longitude: listing.longitude }
      : null,
  );
  const [experienceYears, setExperienceYears] = useState(
    listing?.experienceYears != null ? String(listing.experienceYears) : "",
  );
  const [hourlyRate, setHourlyRate] = useState(
    listing?.hourlyRate != null ? String(listing.hourlyRate) : "",
  );
  const [compensationType, setCompensationType] = useState<CompensationType>(
    listing?.compensationType ?? "negotiable",
  );
  const [workMode, setWorkMode] = useState<WorkMode>(
    listing?.workMode ?? "onsite",
  );

  useEffect(() => {
    if (workMode === "remote") {
      setLocation(null);
    }
  }, [workMode]);
  const [skills, setSkills] = useState(listing?.skills.join(", ") ?? "");
  const [status, setStatus] = useState<ListingStatus>(
    listing?.status ?? "active",
  );
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    getCategories()
      .then(({ groups: data }) => setGroups(data))
      .catch(() => setError(messages.listingForm.loadCategoriesFailed))
      .finally(() => setLoadingCategories(false));
  }, [messages]);

  const hints = useMemo(
    () => getCategoryHints(groups, categoryId, messages),
    [groups, categoryId, messages],
  );

  function validateStep(current: number): string | null {
    if (current === 1) {
      if (!categoryId) return messages.listingForm.categoryRequired;
      if (photos.length === 0) return messages.listingForm.photosRequired;
    }
    if (current === 2) {
      if (!title.trim()) return messages.listingForm.titleRequired;
      if (description.trim().length < 10)
        return messages.listingForm.descriptionRequired;
      if (!city.trim()) return messages.listingForm.cityRequired;
    }
    return null;
  }

  function goNext() {
    const validationError = validateStep(step);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();

    const validationError = validateStep(2);
    if (validationError) {
      setError(validationError);
      setStep(2);
      return;
    }

    setError(null);
    setSubmitting(true);

    const payload = {
      categoryId,
      title: title.trim(),
      description: description.trim(),
      city: city.trim(),
      latitude:
        workMode === "remote" ? null : (location?.latitude ?? null),
      longitude:
        workMode === "remote" ? null : (location?.longitude ?? null),
      experienceYears: experienceYears
        ? Number.parseInt(experienceYears, 10)
        : undefined,
      hourlyRate:
        compensationType !== "negotiable" && hourlyRate
          ? Number.parseInt(hourlyRate, 10)
          : undefined,
      compensationType,
      workMode,
      skills: splitList(skills),
      examples: photos,
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
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (step < TOTAL_STEPS) goNext();
        else void handleSubmit();
      }}
      className="space-y-6">
      <StepProgress step={step} />

      {error ? (
        <div
          role="alert"
          className="rounded-xl bg-error-soft px-4 py-3 text-sm text-error-foreground">
          {error}
        </div>
      ) : null}

      {step === 1 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {messages.listingForm.step1Heading}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {messages.listingForm.step1Subtitle}
            </p>
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="categoryId"
              className="text-sm font-medium text-foreground">
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
                <optgroup key={group.categoryId} label={categoryName(group)}>
                  {group.children.map((child) => (
                    <option key={child.categoryId} value={child.categoryId}>
                      {child.icon} {categoryName(child)}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <p className="text-sm font-medium text-foreground">
              {messages.listingForm.photosLabel}
            </p>
            <ListingPhotosUpload
              photos={photos}
              onChange={setPhotos}
              hint={categoryId ? hints.photo : undefined}
            />
          </div>
        </div>
      ) : null}

      {step === 2 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {messages.listingForm.step2Heading}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {messages.listingForm.step2Subtitle}
            </p>
          </div>

          <FormField
            id="title"
            label={messages.listingForm.title}
            required
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={hints.title}
            hint={categoryId ? `💡 ${hints.title}` : undefined}
          />

          <div className="space-y-1.5">
            <label
              htmlFor="description"
              className="text-sm font-medium text-foreground">
              {messages.listingForm.description}
            </label>
            <textarea
              id="description"
              required
              rows={6}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={hints.description}
              className={textareaClass}
            />
            {categoryId ? (
              <p className="text-xs text-foreground-subtle">
                💡 {hints.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label htmlFor="city" className="text-sm font-medium text-foreground">
                {messages.listingForm.city}
              </label>
              <select
                id="city"
                required
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className={selectClass}>
                <option value="">{messages.listingForm.selectCity}</option>
                {GEORGIAN_CITIES.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
                {(GEORGIAN_CITIES as readonly string[]).includes(city) ? null : city ? (
                  <option value={city}>{city}</option>
                ) : null}
              </select>
            </div>

            <FormField
              id="experienceYears"
              label={messages.listingForm.experience}
              type="number"
              min={0}
              max={80}
              value={experienceYears}
              onChange={(e) => setExperienceYears(e.target.value)}
            />
          </div>

          {workMode !== "remote" ? (
            <ListingLocationPicker
              city={city}
              value={location}
              onChange={setLocation}
            />
          ) : null}
        </div>
      ) : null}

      {step === 3 ? (
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              {messages.listingForm.step3Heading}
            </h2>
            <p className="mt-1 text-sm text-foreground-muted">
              {messages.listingForm.step3Subtitle}
            </p>
          </div>

          <RadioButtonGroup
            label={messages.listingForm.compensationType}
            value={compensationType}
            onChange={setCompensationType}
            options={[
              {
                value: "one_time",
                label: messages.filters.compensationOneTime,
              },
              {
                value: "monthly",
                label: messages.filters.compensationMonthly,
              },
              { value: "hourly", label: messages.filters.compensationHourly },
              {
                value: "negotiable",
                label: messages.filters.compensationNegotiable,
              },
            ]}
          />

          {compensationType !== "negotiable" ? (
            <FormField
              id="hourlyRate"
              label={messages.listingForm.priceLabel(compensationType)}
              type="number"
              min={0}
              value={hourlyRate}
              onChange={(e) => setHourlyRate(e.target.value)}
            />
          ) : null}

          <RadioButtonGroup
            label={messages.listingForm.workMode}
            value={workMode}
            onChange={setWorkMode}
            options={[
              { value: "onsite", label: messages.filters.workModeOnsite },
              { value: "remote", label: messages.filters.workModeRemote },
              { value: "hybrid", label: messages.filters.workModeHybrid },
            ]}
          />

          <FormField
            id="skills"
            label={messages.listingForm.skills}
            value={skills}
            onChange={(e) => setSkills(e.target.value)}
            placeholder={messages.listingForm.skillsPlaceholder}
            hint={messages.listingForm.skillsHint}
          />

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
              <option value="archived">
                {messages.listingForm.statusArchived}
              </option>
            </select>
            <p className="text-xs text-foreground-subtle">
              {messages.listingForm.statusHint}
            </p>
          </div>
        </div>
      ) : null}

      <div className="flex items-center justify-between gap-3 border-t border-border pt-6">
        {step > 1 ? (
          <button
            type="button"
            onClick={goBack}
            className="inline-flex items-center gap-1.5 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-background-muted">
            <HiOutlineArrowLeft className="size-4" aria-hidden />
            {messages.listingForm.back}
          </button>
        ) : (
          <span />
        )}

        <button
          type="button"
          disabled={submitting || loadingCategories}
          onClick={step < TOTAL_STEPS ? goNext : () => void handleSubmit()}
          className="inline-flex items-center gap-1.5 rounded-xl bg-accent px-5 py-2.5 text-sm font-medium text-foreground-on-accent transition-colors hover:bg-accent-hover disabled:cursor-not-allowed disabled:opacity-60">
          {step < TOTAL_STEPS ? (
            <>
              {messages.listingForm.next}
              <HiOutlineArrowRight className="size-4" aria-hidden />
            </>
          ) : submitting ? (
            messages.listingForm.submitting
          ) : mode === "create" ? (
            messages.listingForm.createSubmit
          ) : (
            messages.listingForm.editSubmit
          )}
        </button>
      </div>
    </form>
  );
}
