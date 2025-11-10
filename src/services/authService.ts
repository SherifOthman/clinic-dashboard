import { AuthResponse } from "@/types";
import axios from "axios";
import { clearAuth, setAuth } from "./auth";

const API_URL = import.meta.env.VITE_API_URL;

export const login = async (email: string, password: string) => {
  // FOR TESTING: Accept any email and password
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 500));

  // Create mock user data
  const mockUser = {
    id: "1",
    email: email,
    firstName: "Test",
    lastName: "User",
    phone: "+1 (555) 123-4567",
    role: "admin" as const,
  };

  const mockToken = "mock-jwt-token-" + Date.now();

  setAuth(mockToken, mockUser);
  return;

  /* ORIGINAL CODE - Commented out for testing
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
  */
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
