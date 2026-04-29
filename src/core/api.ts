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
    // Don't redirect — let route guards (RequireAuth/RequireRole) handle navigation.
    // Throwing lets the calling component decide how to handle it.
    const err = await res.json().catch(() => ({}));
    const message = err.detail ?? err.title ?? "Forbidden";
    throw Object.assign(new Error(message), { code: err.code, status: 403 });
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

let _redirecting = false;

function redirectToLogin(): void {
  const publicPaths = ["/unauthorized"];
  if (_redirecting) return;
  if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
    _redirecting = true;
    window.location.replace(LOGIN_URL);
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

  /** POST JSON and return the last segment of the Location response header (e.g. created resource ID). */
  postForId: async (path: string, body?: unknown): Promise<string> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { redirectToLogin(); throw new Error("Unauthorized"); }
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw Object.assign(new Error(err.detail ?? err.title ?? `Error ${res.status}`), { status: res.status });
    }
    const location = res.headers.get("location") ?? "";
    return location.split("/").pop() ?? "";
  },

  /** PUT with multipart FormData (e.g. file upload) — no Content-Type header so browser sets boundary. */
  putFormData: async (path: string, formData: FormData): Promise<void> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    if (res.status === 401) { redirectToLogin(); throw new Error("Unauthorized"); }
    if (!res.ok) throw new Error(`Error ${res.status}`);
  },
};
