const API_BASE =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "http://localhost:8080";

type ServerFetchOptions = {
  auth?: boolean;
};

export async function serverFetch<T>(
  path: string,
  options: ServerFetchOptions = {},
): Promise<T> {
  const headers: HeadersInit = {};

  if (options.auth) {
    const { cookies } = await import("next/headers");
    const cookieStore = await cookies();
    const cookieHeader = cookieStore
      .getAll()
      .map((cookie) => `${cookie.name}=${cookie.value}`)
      .join("; ");
    if (cookieHeader) {
      headers.cookie = cookieHeader;
    }
  }

  const res = await fetch(`${API_BASE}${path}`, {
    next: { revalidate: 30 },
    headers,
  });

  if (!res.ok) {
    throw new Error(`API ${path} failed with ${res.status}`);
  }

  return res.json() as Promise<T>;
}

export { API_BASE };
