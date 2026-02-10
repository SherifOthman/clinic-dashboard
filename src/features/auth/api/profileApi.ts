import { apiClient } from "@/core/api/client";
import type { User } from "../types/index";

export interface UpdateProfileRequest {
  firstName: string;
  lastName: string;
  phoneNumber?: string;
}

/**
 * Profile API service
 */
export const profileApi = {
  /**
   * Update user profile information
   */
  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    const response = await apiClient.put<User>("/auth/profile", data);
    return response.data;
  },

  /**
   * Update profile image
   */
  async updateProfileImage(image: File) {
    const formData = new FormData();
    formData.append("file", image);

    const response = await apiClient.post(
      "/auth/profile/image/upload",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  /**
   * Delete profile image
   */
  async deleteProfileImage(): Promise<User> {
    const response = await apiClient.delete<User>("/auth/profile/image");
    return response.data;
  },
};
