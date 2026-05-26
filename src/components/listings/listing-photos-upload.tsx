"use client";

import { useRef, useState } from "react";
import { HiOutlinePhoto, HiOutlineTrash, HiOutlineXMark } from "react-icons/hi2";
import { uploadImage } from "@/lib/api/auth";
import { messages } from "@/lib/i18n/messages";

const MAX_PHOTOS = 6;
const MAX_BYTES = 5 * 1024 * 1024;

type ListingPhotosUploadProps = {
  photos: string[];
  onChange: (photos: string[]) => void;
  hint?: string;
};

export function ListingPhotosUpload({
  photos,
  onChange,
  hint,
}: ListingPhotosUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewIndex, setPreviewIndex] = useState<number | null>(null);

  async function handleFiles(fileList: FileList | null) {
    setError(null);
    if (!fileList?.length) return;

    const remaining = MAX_PHOTOS - photos.length;
    if (remaining <= 0) {
      setError(messages.listingForm.photosMax);
      return;
    }

    const files = Array.from(fileList).slice(0, remaining);
    for (const file of files) {
      if (!file.type.startsWith("image/")) {
        setError(messages.profile.chooseImage);
        return;
      }
      if (file.size > MAX_BYTES) {
        setError(messages.listingForm.photoTooLarge);
        return;
      }
    }

    setUploading(true);
    const uploaded: string[] = [];

    try {
      for (const file of files) {
        const url = await uploadImage(file);
        if (typeof url === "string" && url.startsWith("http")) {
          uploaded.push(url);
        }
      }
      if (uploaded.length > 0) {
        onChange([...photos, ...uploaded]);
      } else {
        setError(messages.profile.uploadFailed);
      }
    } catch {
      setError(messages.profile.uploadFailed);
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  }

  function removePhoto(index: number) {
    onChange(photos.filter((_, i) => i !== index));
    if (previewIndex === index) setPreviewIndex(null);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {photos.map((url, index) => (
          <div
            key={`${url}-${index}`}
            className="group relative aspect-square overflow-hidden rounded-xl border border-border bg-background-muted">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={url}
              alt=""
              className="size-full cursor-pointer object-cover transition-transform group-hover:scale-105"
              onClick={() => setPreviewIndex(index)}
            />
            {index === 0 ? (
              <span className="absolute left-1.5 top-1.5 rounded-md bg-black/60 px-1.5 py-0.5 text-[10px] font-medium text-white">
                {messages.listingForm.coverPhoto}
              </span>
            ) : null}
            <button
              type="button"
              onClick={() => removePhoto(index)}
              className="absolute right-1.5 top-1.5 inline-flex size-6 items-center justify-center rounded-full bg-black/60 text-white opacity-0 transition-opacity group-hover:opacity-100 focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              aria-label={messages.listingForm.removePhoto}>
              <HiOutlineXMark className="size-3.5" aria-hidden />
            </button>
          </div>
        ))}

        {photos.length < MAX_PHOTOS ? (
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-border bg-background-muted/50 text-foreground-muted transition-colors hover:border-accent hover:bg-accent-soft/30 hover:text-foreground-accent disabled:cursor-not-allowed disabled:opacity-60">
            <HiOutlinePhoto className="size-6" aria-hidden />
            <span className="text-[10px] font-medium sm:text-xs">
              {uploading
                ? messages.profile.uploading
                : messages.listingForm.addPhoto}
            </span>
          </button>
        ) : null}
      </div>

      <p className="text-xs text-foreground-subtle">
        {messages.listingForm.photosCount(photos.length, MAX_PHOTOS)}
      </p>

      {hint ? (
        <p className="rounded-lg bg-accent-soft/50 px-3 py-2 text-xs leading-relaxed text-foreground-accent">
          💡 {hint}
        </p>
      ) : null}

      {error ? <p className="text-xs text-error">{error}</p> : null}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        className="sr-only"
        onChange={(e) => void handleFiles(e.target.files)}
      />

      {previewIndex != null && photos[previewIndex] ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          role="dialog"
          aria-modal="true"
          onClick={() => setPreviewIndex(null)}>
          <div className="relative max-h-[85vh] max-w-3xl">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={photos[previewIndex]}
              alt=""
              className="max-h-[85vh] rounded-xl object-contain"
              onClick={(e) => e.stopPropagation()}
            />
            <button
              type="button"
              onClick={() => removePhoto(previewIndex)}
              className="absolute -bottom-12 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-lg bg-error px-3 py-1.5 text-xs font-medium text-white">
              <HiOutlineTrash className="size-3.5" aria-hidden />
              {messages.listingForm.removePhoto}
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
