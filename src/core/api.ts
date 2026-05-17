import axios from "axios";

const LOGIN_URL =
  (import.meta.env.VITE_AUTH_URL as string | undefined) ??
  "https://clinic-website-lime.vercel.app/en/login";

export interface ApiProblemDetails {
  type: string;
  title: string;
  status: number;
  detail: string | null;
  code: string | null;
  errors: Record<string, string[]> | null;
  traceId: string | null;
}

let _redirecting = false;

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL as string,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

apiClient.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401 && !_redirecting) {
      const publicPaths = ["/unauthorized"];
      if (!publicPaths.some((p) => window.location.pathname.startsWith(p))) {
        _redirecting = true;
        window.location.replace(LOGIN_URL);
      }
    }
    return Promise.reject(error);
  },
);
