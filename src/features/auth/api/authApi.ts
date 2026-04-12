import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type {
  ChangePassword,
  ConfirmEmail,
  ForgotPassword,
  Login,
  Register,
  ResendEmailVerification,
  ResetPassword,
} from "../schemas";
import type { Availability, LoginResponse, User } from "../types";

export const authApi = {
  async register(data: Register): Promise<void> {
    await apiClient.post(`${API_ENDPOINTS.auth}/register`, data);
  },

  async login(data: Login): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      `${API_ENDPOINTS.auth}/login`,
      data,
    );
    return response.data;
  },

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
    await apiClient.post(
      `${API_ENDPOINTS.auth}/resend-email-verification`,
      data,
    );
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>(`${API_ENDPOINTS.auth}/me`);
    return response.data;
  },

  async checkEmailAvailability(email: string): Promise<Availability> {
    const response = await apiClient.get<Availability>(
      `${API_ENDPOINTS.auth}/check-email`,
      { params: { email } },
    );
    return response.data;
  },

  async checkUsernameAvailability(username: string): Promise<Availability> {
    const response = await apiClient.get<Availability>(
      `${API_ENDPOINTS.auth}/check-username`,
      { params: { username } },
    );
    return response.data;
  },

  // Profile management
  async updateProfile(data: {
    firstName: string;
    lastName: string;
    userName: string;
    phoneNumber?: string;
    gender: string;
  }): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.auth}/profile`, data);
  },

  async updateProfileImage(image: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", image);

    await apiClient.post(
      `${API_ENDPOINTS.auth}/profile/image/upload`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
  },

  async deleteProfileImage(): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.auth}/profile/image`);
  },
};
