const BASE_URL = import.meta.env.VITE_API_URL as string;
const LOGIN_URL = (import.meta.env.VITE_AUTH_URL as string | undefined)
  ?? "https://clinic-website-lime.vercel.app/en/login";

export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string | null;
  code: string | null;
  errors: Record<string, string[]> | null;
  traceId: string | null;
}

export type ApiResult<T = void> =
  | { ok: true; data: T }
  | { ok: false; problem: ApiProblemDetails };

export async function apiFetch<T = unknown>(
  path: string,
  options: RequestInit = {},
): Promise<ApiResult<T>> {
  const res = await fetch(`${BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  if (res.status === 401) {
    redirectToLogin();
    return { ok: false, problem: null! };
  }

  if (res.ok) {
    const text = await res.text();
    return { ok: true, data: (text ? JSON.parse(text) : undefined) as T };
  }

  const err = await res.json().catch(() => ({})) as Partial<ApiProblemDetails>;
  return {
    ok: false,
    problem: {
      type: err.type ?? "",
      title: err.title ?? `Error ${res.status}`,
      status: err.status ?? res.status,
      detail: err.detail ?? null,
      code: err.code ?? null,
      errors: err.errors ?? null,
      traceId: err.traceId ?? null,
    },
  };
}

export function unwrap<T>(result: ApiResult<T>): T {
  if (result.ok) return result.data;
  const error = Object.assign(
    new Error(result.problem.detail ?? result.problem.title),
    { problem: result.problem, status: result.problem.status },
  );
  throw error;
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

export const apiClient = {
  get: <T>(path: string) => apiFetch<T>(path).then(unwrap),

  post: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "POST", body: body ? JSON.stringify(body) : undefined }).then(unwrap),

  put: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PUT", body: body ? JSON.stringify(body) : undefined }).then(unwrap),

  patch: <T>(path: string, body?: unknown) =>
    apiFetch<T>(path, { method: "PATCH", body: body ? JSON.stringify(body) : undefined }).then(unwrap),

  delete: <T>(path: string) =>
    apiFetch<T>(path, { method: "DELETE" }).then(unwrap),

  postForId: async (path: string, body?: unknown): Promise<string> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if (res.status === 401) { redirectToLogin(); throw new Error("Unauthorized"); }
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as Partial<ApiProblemDetails>;
      const problem: ApiProblemDetails = {
        type: err.type ?? "",
        title: err.title ?? `Error ${res.status}`,
        status: err.status ?? res.status,
        detail: err.detail ?? null,
        code: err.code ?? null,
        errors: err.errors ?? null,
        traceId: err.traceId ?? null,
      };
      throw Object.assign(new Error(problem.detail ?? problem.title), { problem, status: problem.status });
    }
    const location = res.headers.get("location") ?? "";
    return location.split("/").pop() ?? "";
  },

  putFormData: async (path: string, formData: FormData): Promise<void> => {
    const res = await fetch(`${BASE_URL}${path}`, {
      method: "PUT",
      credentials: "include",
      body: formData,
    });
    if (res.status === 401) { redirectToLogin(); throw new Error("Unauthorized"); }
    if (!res.ok) {
      const err = await res.json().catch(() => ({})) as Partial<ApiProblemDetails>;
      const problem: ApiProblemDetails = {
        type: err.type ?? "",
        title: err.title ?? `Error ${res.status}`,
        status: err.status ?? res.status,
        detail: err.detail ?? null,
        code: err.code ?? null,
        errors: err.errors ?? null,
        traceId: err.traceId ?? null,
      };
      throw Object.assign(new Error(problem.detail ?? problem.title), { problem, status: problem.status });
    }
  },
};
