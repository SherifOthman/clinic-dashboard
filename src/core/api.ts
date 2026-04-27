/**
 * API client using native fetch.
 * Both access and refresh tokens live in HttpOnly cookies — the browser
 * sends them automatically on every request. No manual token management needed.
 *
 * On 401: the backend tries to refresh automatically via the cookie middleware.
 * If refresh also fails, we redirect to the Next.js login page.
 */

const BASE_URL = import.meta.env.VITE_API_URL as string;
const LOGIN_URL = (import.meta.env.VITE_AUTH_URL as string | undefined)
  ?? "http://localhost:3001/en/login";

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include", // sends HttpOnly cookies automatically
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    // Backend couldn't refresh — send user to login
    redirectToLogin();
    throw new Error("Unauthorized");
  }

  if (res.status === 403) {
    window.location.href = "/unauthorized";
    throw new Error("Forbidden");
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    const message = err.detail ?? err.title ?? `Error ${res.status}`;
    const error = Object.assign(new Error(message), { code: err.code, errors: err.errors, status: res.status });
    throw error;
  }

  const text = await res.text();
  return (text ? JSON.parse(text) : undefined) as T;
}

function redirectToLogin(): void {
  const publicPaths = ["/unauthorized"];
  if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
    window.location.href = LOGIN_URL;
  }
}

// ── Convenience methods ───────────────────────────────────────────────────────

export const apiClient = {
  get: <T>(path: string) => apiFetch<T>(path),
  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }),
  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }),
  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }),
  delete: <T>(path: string) => apiFetch<T>(path, { method: "DELETE" }),
};
