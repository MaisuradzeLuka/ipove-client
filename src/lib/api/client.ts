import { messages } from "@/lib/i18n/messages";
import { translateApiError } from "@/lib/i18n/translate-api-error";

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public body?: unknown,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

async function parseErrorMessage(res: Response): Promise<string> {
  try {
    const data = await res.json();
    if (typeof data === "string") return translateApiError(data);
    if (data && typeof data === "object") {
      if ("error" in data) {
        const err = (data as { error: unknown }).error;
        if (typeof err === "string") return translateApiError(err);
        if (Array.isArray(err) && err[0]?.message) {
          return translateApiError(String(err[0].message));
        }
      }
      if ("message" in data && typeof (data as { message: unknown }).message === "string") {
        return translateApiError((data as { message: string }).message);
      }
    }
  } catch {
    /* ignore */
  }
  return translateApiError(res.statusText || messages.auth.requestFailed);
}

export async function apiFetch<T>(
  path: string,
  init?: RequestInit,
): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      ...(init?.body instanceof FormData
        ? {}
        : { "Content-Type": "application/json" }),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    const message = await parseErrorMessage(res);
    throw new ApiError(message, res.status);
  }

  if (res.status === 204) {
    return undefined as T;
  }

  const contentType = res.headers.get("content-type") ?? "";
  if (contentType.includes("application/json")) {
    return res.json() as Promise<T>;
  }

  return (await res.text()) as T;
}

export { API_BASE };
