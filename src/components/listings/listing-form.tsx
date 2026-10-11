"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  HiOutlineArrowLeft,
  HiOutlineArrowRight,
  HiOutlineCheck,
} from "react-icons/hi2";
import { FormField } from "@/components/auth/form-field";
import { Select } from "@/components/select";
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

type ListingField =
  | "categoryId"
  | "photos"
  | "title"
  | "description"
  | "city"
  | "experienceYears"
  | "hourlyRate"
  | "skills";

const STEP_FIELDS: Record<number, ListingField[]> = {
  1: ["categoryId", "photos"],
  2: ["title", "description", "city", "experienceYears"],
  3: ["hourlyRate", "skills"],
};

function FieldErrorText({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="text-xs text-error">
      {message}
    </p>
  );
}

function invalidControlClass(base: string, invalid: boolean) {
  return invalid
    ? `${base} border-error focus-visible:ring-error`
    : base;
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
  const [dirty, setDirty] = useState<Partial<Record<ListingField, boolean>>>(
    {},
  );
  const [submitting, setSubmitting] = useState(false);

  function markDirty(field: ListingField) {
    setDirty((current) =>
      current[field] ? current : { ...current, [field]: true },
    );
  }

  function markFieldsDirty(fields: ListingField[]) {
    setDirty((current) => {
      const next = { ...current };
      for (const field of fields) next[field] = true;
      return next;
    });
  }

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

  const fieldErrors = useMemo(() => {
    const next: Partial<Record<ListingField, string>> = {};
    const trimmedTitle = title.trim();
    const trimmedDescription = description.trim();

    if (!categoryId) next.categoryId = messages.listingForm.categoryRequired;
    if (photos.length === 0) next.photos = messages.listingForm.photosRequired;
    else if (photos.length > 6) next.photos = messages.listingForm.photosMax;

    if (!trimmedTitle) next.title = messages.listingForm.titleRequired;
    else if (trimmedTitle.length < 3) next.title = messages.listingForm.titleMin;
    else if (trimmedTitle.length > 120) next.title = messages.listingForm.titleMax;

    if (trimmedDescription.length < 10) {
      next.description = messages.listingForm.descriptionRequired;
    } else if (trimmedDescription.length > 5000) {
      next.description = messages.listingForm.descriptionMax;
    }

    if (!city.trim()) next.city = messages.listingForm.cityRequired;

    if (experienceYears.trim()) {
      const years = Number(experienceYears);
      if (!Number.isInteger(years) || years < 0 || years > 80) {
        next.experienceYears = messages.listingForm.experienceInvalid;
      }
    }

    if (compensationType !== "negotiable" && hourlyRate.trim()) {
      const rate = Number(hourlyRate);
      if (!Number.isInteger(rate) || rate < 0 || rate > 1_000_000) {
        next.hourlyRate = messages.listingForm.priceInvalid;
      }
    }

    const skillList = splitList(skills);
    if (skillList.length > 20 || skillList.some((skill) => skill.length > 50)) {
      next.skills = messages.listingForm.skillsInvalid;
    }

    return next;
  }, [
    categoryId,
    photos.length,
    title,
    description,
    city,
    experienceYears,
    compensationType,
    hourlyRate,
    skills,
    messages,
  ]);

  function shownError(field: ListingField) {
    return dirty[field] ? fieldErrors[field] : undefined;
  }

  function stepHasErrors(current: number) {
    return STEP_FIELDS[current].some((field) => fieldErrors[field]);
  }

  function goNext() {
    markFieldsDirty(STEP_FIELDS[step]);
    if (stepHasErrors(step)) return;
    setError(null);
    setStep((s) => Math.min(s + 1, TOTAL_STEPS));
  }

  function goBack() {
    setError(null);
    setStep((s) => Math.max(s - 1, 1));
  }

  async function handleSubmit(e?: FormEvent) {
    e?.preventDefault();

    markFieldsDirty([
      ...STEP_FIELDS[1],
      ...STEP_FIELDS[2],
      ...STEP_FIELDS[3],
    ]);
    const invalidStep = [1, 2, 3].find((current) => stepHasErrors(current));
    if (invalidStep) {
      setStep(invalidStep);
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
            <Select
              id="categoryId"
              label={messages.listingForm.category}
              disabled={loadingCategories}
              value={categoryId}
              invalid={Boolean(shownError("categoryId"))}
              describedBy={
                shownError("categoryId") ? "categoryId-error" : undefined
              }
              onBlur={() => markDirty("categoryId")}
              onChange={setCategoryId}
              placeholder={
                loadingCategories
                  ? messages.listingForm.loadingCategories
                  : messages.listingForm.selectCategory
              }
              options={[
                {
                  value: "",
                  label: loadingCategories
                    ? messages.listingForm.loadingCategories
                    : messages.listingForm.selectCategory,
                },
              ]}
              groups={groups.map((group) => ({
                label: categoryName(group),
                options: group.children.map((child) => ({
                  value: child.categoryId,
                  label: `${child.icon} ${categoryName(child)}`,
                })),
              }))}
            />
            <FieldErrorText
              id="categoryId-error"
              message={shownError("categoryId")}
            />
          </div>

          <div
            className="space-y-2"
            onBlur={(e) => {
              if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                markDirty("photos");
              }
            }}>
            <p className="text-sm font-medium text-foreground">
              {messages.listingForm.photosLabel}
            </p>
            <ListingPhotosUpload
              photos={photos}
              onChange={setPhotos}
              hint={categoryId ? hints.photo : undefined}
            />
            <FieldErrorText id="photos-error" message={shownError("photos")} />
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
            error={shownError("title")}
            onBlur={() => markDirty("title")}
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
              aria-invalid={shownError("description") ? true : undefined}
              aria-describedby={
                shownError("description")
                  ? "description-error"
                  : categoryId
                    ? "description-hint"
                    : undefined
              }
              onBlur={() => markDirty("description")}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={hints.description}
              className={invalidControlClass(
                textareaClass,
                Boolean(shownError("description")),
              )}
            />
            {shownError("description") ? (
              <FieldErrorText
                id="description-error"
                message={shownError("description")}
              />
            ) : categoryId ? (
              <p id="description-hint" className="text-xs text-foreground-subtle">
                💡 {hints.description}
              </p>
            ) : null}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <Select
                id="city"
                label={messages.listingForm.city}
                value={city}
                invalid={Boolean(shownError("city"))}
                describedBy={shownError("city") ? "city-error" : undefined}
                onBlur={() => markDirty("city")}
                onChange={setCity}
                placeholder={messages.listingForm.selectCity}
                options={[
                  { value: "", label: messages.listingForm.selectCity },
                  ...GEORGIAN_CITIES.map((c) => ({ value: c, label: c })),
                  ...((GEORGIAN_CITIES as readonly string[]).includes(city) ||
                  !city
                    ? []
                    : [{ value: city, label: city }]),
                ]}
              />
              <FieldErrorText id="city-error" message={shownError("city")} />
            </div>

            <FormField
              id="experienceYears"
              label={messages.listingForm.experience}
              type="number"
              min={0}
              max={80}
              value={experienceYears}
              error={shownError("experienceYears")}
              onBlur={() => markDirty("experienceYears")}
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
              error={shownError("hourlyRate")}
              onBlur={() => markDirty("hourlyRate")}
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
            error={shownError("skills")}
            onBlur={() => markDirty("skills")}
            onChange={(e) => setSkills(e.target.value)}
            placeholder={messages.listingForm.skillsPlaceholder}
            hint={messages.listingForm.skillsHint}
          />

          <div className="space-y-1.5">
            <Select
              id="status"
              label={messages.listingForm.status}
              value={status}
              describedBy="status-hint"
              onChange={(next) => setStatus(next as ListingStatus)}
              options={[
                { value: "draft", label: messages.listingForm.statusDraft },
                { value: "active", label: messages.listingForm.statusActive },
                {
                  value: "archived",
                  label: messages.listingForm.statusArchived,
                },
              ]}
            />
            <p id="status-hint" className="text-xs text-foreground-subtle">
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
