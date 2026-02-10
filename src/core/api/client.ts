import axios from "axios";

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  timeout: 30000,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;

    if (status === 401) {
      const currentPath = window.location.pathname;
      const authPaths = [
        "/login",
        "/register",
        "/forgot-password",
        "/reset-password",
        "/confirm-email",
      ];

      if (!authPaths.some((path) => currentPath.startsWith(path))) {
        window.location.href = "/login";
      }
    }

    if (status === 403) {
      window.location.href = "/unauthorized";
    }

    return Promise.reject(error);
  },
);
