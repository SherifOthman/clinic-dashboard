import { AuthResponse } from "@/types";
import axios from "axios";
import { clearAuth, getAccessToken, setAuth } from "./auth";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  if (getAccessToken()) {
    config.headers.Authorization = `Bearer ${getAccessToken()}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const response: AuthResponse = await axios.post("/auth/refresh-token");
        // Update the auth state with the new token
        setAuth(response.accessToken, response.user);
        originalRequest.headers.Authorization = `Bearer ${response.accessToken}`;

        // Retry the original request with the new token
        return api(originalRequest);
      } catch (err) {
        clearAuth();
        window.location.href = "/login";
        return Promise.reject(err);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
