import { ApiError, AuthResponse } from "@/types";
import axios, { AxiosError } from "axios";
import { ApiException } from "./apiException";
import { clearAuth, setAuth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_URL}/auth/login`,
      { email, password },
      { withCredentials: true }
    );
    setAuth(res.data.accessToken, res.data.user);
  } catch (error) {
    clearAuth();
    const axiosError = error as AxiosError<ApiError>;
    throw new ApiException(axiosError.response?.data!);
  }
};

export const logout = async (): Promise<void> => {
  await axios.post(`${API_URL}/auth/logout`, {}, { withCredentials: true });
  clearAuth();
};

export const refreshToken = async (): Promise<boolean> => {
  try {
    const res = await axios.post<AuthResponse>(
      `${API_URL}/auth/refresh-token`,
      {},
      { withCredentials: true }
    );
    setAuth(res.data.accessToken, res.data.user);
    return true;
  } catch (error) {
    clearAuth();
    return false;
  }
};
