const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
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

  if (res.status === 204) {
    return undefined as T;
  }

  const data: unknown = await res.json().catch(() => null);

  if (!res.ok) {
    const message = formatApiError(data, res.status);
    throw new ApiError(message, res.status);
  }

  return data as T;
}

function formatApiError(data: unknown, status: number): string {
  if (data && typeof data === "object") {
    const err = data as { error?: unknown; message?: unknown };
    if (typeof err.error === "string") return err.error;
    if (Array.isArray(err.error)) {
      const first = err.error[0] as { message?: string } | undefined;
      if (first?.message) return first.message;
    }
    if (typeof err.message === "string") return err.message;
  }
  return status === 401
    ? "Invalid email or password."
    : "Something went wrong. Please try again.";
}
