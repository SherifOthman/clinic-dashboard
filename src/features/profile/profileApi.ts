import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { UpdateProfile } from "@/features/auth/schemas";

/**
 * Profile API calls.
 * Profile data retrieval (getMe) lives in authApi because it is also used
 * by the auth flow. This module owns the write-side profile operations.
 */
export const profileApi = {
  async updateProfile(data: UpdateProfile): Promise<void> {
    await apiClient.put(`${API_ENDPOINTS.auth}/profile`, data);
  },

  async updateProfileImage(image: File): Promise<void> {
    const formData = new FormData();
    formData.append("file", image);
    await apiClient.post(
      `${API_ENDPOINTS.auth}/profile/image/upload`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } },
    );
  },

  async deleteProfileImage(): Promise<void> {
    await apiClient.delete(`${API_ENDPOINTS.auth}/profile/image`);
  },
};
