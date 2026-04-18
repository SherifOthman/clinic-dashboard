import axios, { type InternalAxiosRequestConfig } from "axios";

// ── In-memory token store ─────────────────────────────────────────────────────
// The access token is kept in memory (not localStorage) so it can't be read
// by XSS scripts. The refresh token lives in an HttpOnly cookie managed by
// the browser — we never touch it directly.

let accessToken: string | null = null;

// Prevents multiple concurrent 401 responses from each triggering their own
// refresh call. The first one starts the refresh; the rest await the same promise.
let refreshPromise: Promise<string> | null = null;

export const tokenManager = {
  getAccessToken: () => accessToken,
  setAccessToken: (token: string | null) => {
    accessToken = token;
  },
  clearTokens: () => {
    accessToken = null;
  },
  refreshAccessToken,
};

// ── Axios instance ────────────────────────────────────────────────────────────
// withCredentials: true is required so the browser sends the HttpOnly refresh
// cookie on every request (including the /auth/refresh call).

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

// ── Request interceptor ───────────────────────────────────────────────────────
// Attaches the Bearer token to every outgoing request if one is available.

apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = tokenManager.getAccessToken();
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error),
);

// ── Response interceptor ──────────────────────────────────────────────────────
// Handles two cases automatically:
//   401 → try to refresh the access token once, then retry the original request
//   403 → redirect to /unauthorized (user is authenticated but lacks permission)

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;

    if (status === 401 && !originalRequest._retry) {
      // Don't try to refresh if the failing request was itself an auth endpoint
      // (e.g. login failed) — that would cause an infinite loop.
      if (isAuthEndpoint(originalRequest.url)) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        // Deduplicate: if a refresh is already in flight, wait for it
        if (!refreshPromise) {
          refreshPromise = refreshAccessToken();
        }

        const newToken = await refreshPromise;
        originalRequest.headers.Authorization = `Bearer ${newToken}`;

        // Retry the original request with the new token
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh failed (e.g. refresh token expired) — force re-login
        tokenManager.clearTokens();
        redirectToLogin();
        return Promise.reject(refreshError);
      } finally {
        refreshPromise = null;
      }
    }

    if (status === 403) {
      // Only redirect to /unauthorized for page-level navigation requests,
      // not for background data fetches (which should fail gracefully in the component)
      const url = originalRequest.url ?? "";
      const isPageLevelRequest = url.includes("/auth/me");
      if (isPageLevelRequest) {
        redirectToUnauthorized();
      }
    }

    return Promise.reject(error);
  },
);

// ── Helpers ───────────────────────────────────────────────────────────────────

function isAuthEndpoint(url?: string): boolean {
  if (!url) return false;
  const authEndpoints = ["/auth/login", "/auth/register", "/auth/refresh"];
  return authEndpoints.some((endpoint) => url.includes(endpoint));
}

async function refreshAccessToken(): Promise<string> {
  try {
    // Use a plain axios call (not apiClient) to avoid triggering the interceptor again
    const response = await axios.post<{ accessToken: string }>(
      `${import.meta.env.VITE_API_URL}/auth/refresh`,
      {},
      {
        withCredentials: true, // sends the HttpOnly refresh cookie
        timeout: 10000,
      },
    );

    const newAccessToken = response.data.accessToken;
    tokenManager.setAccessToken(newAccessToken);

    return newAccessToken;
  } catch (error) {
    tokenManager.clearTokens();
    throw error;
  }
}

function redirectToLogin(): void {
  const currentPath = window.location.pathname;
  const publicPaths = [
    "/login",
    "/register",
    "/forgot-password",
    "/reset-password",
    "/confirm-email",
    "/verify-email",
    "/password-changed",
    "/resend-email-verification",
  ];

  // Don't redirect if already on a public page — avoids redirect loops
  const isPublicPath = publicPaths.some((path) => currentPath.startsWith(path));

  if (!isPublicPath) {
    window.location.href = "/login";
  }
}

function redirectToUnauthorized(): void {
  window.location.href = "/unauthorized";
}
