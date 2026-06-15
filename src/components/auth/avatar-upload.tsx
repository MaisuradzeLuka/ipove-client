"use client";

import { useRef, useState } from "react";
import { HiOutlinePencil } from "react-icons/hi2";
import { UserAvatar } from "@/components/auth/user-avatar";
import { useMessages } from "@/contexts/locale-context";
import type { User } from "@/lib/auth/types";

type AvatarUploadProps = {
  user: Pick<User, "name" | "lastname" | "email" | "avatar">;
  displayName: string;
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | null>;
};

const MAX_BYTES = 2 * 1024 * 1024;

export function AvatarUpload({
  user,
  displayName,
  previewUrl,
  onPreviewChange,
  onUpload,
}: AvatarUploadProps) {
  const messages = useMessages();
  const inputRef = useRef<HTMLInputElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFile(file: File | undefined) {
    setError(null);
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError(messages.profile.chooseImage);
      return;
    }
    if (file.size > MAX_BYTES) {
      setError(messages.profile.imageTooLarge);
      return;
    }

    const preview = URL.createObjectURL(file);
    onPreviewChange(preview);

    setUploading(true);
    const result = await onUpload(file);
    setUploading(false);

    if (typeof result === "string" && result.startsWith("http")) {
      URL.revokeObjectURL(preview);
      onPreviewChange(result);
      return;
    }

    URL.revokeObjectURL(preview);
    onPreviewChange(user.avatar);
    setError(
      typeof result === "string" ? result : messages.profile.uploadFailed,
    );
  }

  const displayUser = {
    ...user,
    avatar: previewUrl ?? user.avatar,
  };

  const hasPhoto = Boolean(previewUrl || user.avatar);

  function openFilePicker() {
    inputRef.current?.click();
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-4">
        <div className="relative shrink-0">
          <UserAvatar user={displayUser} size="lg" className="size-20 text-xl" />
          <button
            type="button"
            disabled={uploading}
            onClick={openFilePicker}
            className="absolute -bottom-0.5 -right-0.5 inline-flex size-7 items-center justify-center rounded-full border border-border bg-background-surface text-foreground shadow-sm transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:cursor-not-allowed disabled:opacity-60"
            aria-label={
              uploading
                ? messages.profile.uploading
                : hasPhoto
                  ? messages.profile.changePhoto
                  : messages.profile.uploadPhoto
            }>
            <HiOutlinePencil className="size-3.5" aria-hidden />
          </button>
        </div>

        <div className="min-w-0">
          <p className="truncate text-base font-semibold text-foreground">
            {displayName}
          </p>
          <p className="truncate text-sm text-foreground-muted">{user.email}</p>
        </div>
      </div>

      {error && <p className="text-xs text-error">{error}</p>}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(e) => {
          void handleFile(e.target.files?.[0]);
          e.target.value = "";
        }}
      />
    </div>
  );
}
