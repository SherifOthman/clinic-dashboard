import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type {
  ChangePassword,
  ConfirmEmail,
  ForgotPassword,
  ResendEmailVerification,
  ResetPassword,
} from "../schemas";
import type { Availability, User } from "../types";

/**
 * Auth API — all requests use native fetch with credentials: 'include'.
 * Tokens live in HttpOnly cookies; no manual token management needed.
 *
 * Login and Register are handled by the Next.js app — not here.
 */
export const authApi = {
  async logout(): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/logout`);
  },

  async confirmEmail(data: ConfirmEmail): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/confirm-email`, data);
  },

  async forgotPassword(data: ForgotPassword): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/forgot-password`, data);
  },

  async resetPassword(data: ResetPassword): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/reset-password`, data);
  },

  async changePassword(data: ChangePassword): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/change-password`, data);
  },

  async resendEmailVerification(data: ResendEmailVerification): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/resend-email-verification`, data);
  },

  async getMe(): Promise<User> {
    return apiClient.get<User>(`${API_ENDPOINTS.auth}/me`);
  },

  async checkEmailAvailability(email: string): Promise<Availability> {
    return apiClient.get<Availability>(
      `${API_ENDPOINTS.auth}/check-email?email=${encodeURIComponent(email)}`,
    );
  },

  async checkUsernameAvailability(username: string): Promise<Availability> {
    return apiClient.get<Availability>(
      `${API_ENDPOINTS.auth}/check-username?username=${encodeURIComponent(username)}`,
    );
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
