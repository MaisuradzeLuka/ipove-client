import { apiFetch } from "@/lib/api/client";
import type { UpdateUserPayload, User } from "@/lib/auth/types";

type MeResponse = { user: User };

export function getMe() {
  return apiFetch<MeResponse>("/api/v1/auth/me");
}

export function updateUser(body: UpdateUserPayload) {
  return apiFetch<{ message: string }>("/api/v1/auth/update-user", {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export function uploadImage(file: File) {
  const form = new FormData();
  form.append("image", file);
  return apiFetch<string>("/api/v1/upload-image", {
    method: "POST",
    body: form,
  });
}
