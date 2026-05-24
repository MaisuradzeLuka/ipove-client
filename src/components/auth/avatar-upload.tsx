"use client";

import { useRef, useState } from "react";
import { UserAvatar } from "@/components/auth/user-avatar";
import { messages } from "@/lib/i18n/messages";
import type { User } from "@/lib/auth/types";

type AvatarUploadProps = {
  user: Pick<User, "name" | "lastname" | "email" | "avatar">;
  previewUrl: string | null;
  onPreviewChange: (url: string | null) => void;
  onUpload: (file: File) => Promise<string | null>;
};

const MAX_BYTES = 2 * 1024 * 1024;

export function AvatarUpload({
  user,
  previewUrl,
  onPreviewChange,
  onUpload,
}: AvatarUploadProps) {
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

  return (
    <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-start">
      <UserAvatar user={displayUser} size="lg" />
      <div className="flex flex-col gap-2 text-center sm:text-left">
        <p className="text-sm font-medium text-foreground">
          {messages.profile.photoTitle}
        </p>
        <p className="text-xs text-foreground-muted">{messages.profile.photoHint}</p>
        <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
          <button
            type="button"
            disabled={uploading}
            onClick={() => inputRef.current?.click()}
            className="rounded-lg border border-border bg-background-surface px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-background-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-ring-offset disabled:opacity-60">
            {uploading
              ? messages.profile.uploading
              : previewUrl || user.avatar
                ? messages.profile.changePhoto
                : messages.profile.uploadPhoto}
          </button>
        </div>
        {error && <p className="text-xs text-error">{error}</p>}
      </div>
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
