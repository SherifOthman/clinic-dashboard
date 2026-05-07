import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { ChangePassword } from "../schemas";
import type { User } from "../types";

/**
 * Auth API — all requests use native fetch with credentials: 'include'.
 * Tokens live in HttpOnly cookies; no manual token management needed.
 *
 * Login, Register, ForgotPassword, ResetPassword, EmailVerification
 * are all handled by the Next.js website — not here.
 */
export const authApi = {
  async logout(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/logout`);
  },

  async changePassword(data: ChangePassword): Promise<void> {
    await apiClient.patch(`${API_ENDPOINTS.auth}/password`, data);
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>(`${API_ENDPOINTS.auth}/me`);
  },

  async updateProfile(data: {
    fullName: string;
    userName: string;
    phoneNumber?: string;
    gender: string;
  }): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.auth}/profile`, data);
  },

  async updateProfileImage(image: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", image);
    await apiClient.putFormData(`${API_ENDPOINTS.auth}/profile/image`, formData);
  },

  async deleteProfileImage(): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.auth}/profile/image`);
  },
};
