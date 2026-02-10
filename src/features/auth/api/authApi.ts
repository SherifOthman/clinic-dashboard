import { apiClient } from "@/core/api/client";
import type {
  ChangePasswordDto,
  ConfirmEmailDto,
  ForgotPasswordDto,
  LoginDto,
  RegisterDto,
  ResendEmailVerificationDto,
  ResetPasswordDto,
  User,
} from "../types/index";

const BASE_URL = "/auth";

export const authApi = {
  async register(data: RegisterDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/register`, data);
  },

  async login(data: LoginDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/login`, data);
  },

  async logout(): Promise<void> {
    await apiClient.post(`${BASE_URL}/logout`);
  },

  async confirmEmail(data: ConfirmEmailDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/confirm-email`, data);
  },

  async forgotPassword(data: ForgotPasswordDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/forgot-password`, data);
  },

  async resetPassword(data: ResetPasswordDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/reset-password`, data);
  },

  async changePassword(data: ChangePasswordDto): Promise<void> {
    await apiClient.post(`${BASE_URL}/change-password`, data);
  },

  async resendEmailVerification(
    data: ResendEmailVerificationDto,
  ): Promise<void> {
    await apiClient.post(`${BASE_URL}/resend-email-verification`, data);
  },

  async getMe(): Promise<User> {
    const response = await apiClient.get<User>(`${BASE_URL}/me`);
    return response.data;
  },

  async updateProfile(data: any): Promise<User> {
    const response = await apiClient.put<User>(`${BASE_URL}/profile`, data);
    return response.data;
  },

  async updateProfileImage(image: File) {
    const formData = new FormData();
    formData.append("file", image);

    const response = await apiClient.post<User>(
      `${BASE_URL}/profile/image/upload`,
      formData,
      {
        headers: { "Content-Type": "multipart/form-data" },
      },
    );
    return response.data;
  },

  async deleteProfileImage(): Promise<User> {
    const response = await apiClient.delete<User>(`${BASE_URL}/profile/image`);
    return response.data;
  },
};
