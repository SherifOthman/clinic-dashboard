import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";
import type { ChangePassword } from "../schemas";
import type { User } from "../types";

export async function logout(): Promise<void> {
  await apiClient.post(`${API_ENDPOINTS.auth}/logout`);
}

export async function changePassword(data: ChangePassword): Promise<void> {
  await apiClient.patch(`${API_ENDPOINTS.auth}/password`, data);
}

export async function getMe(): Promise<User> {
  const res = await apiClient.get<User>(`${API_ENDPOINTS.auth}/me`);
  return res.data;
}

export async function updateProfile(data: {
  fullName: string;
  userName: string;
  phoneNumber?: string;
  gender: string;
}): Promise<void> {
  await apiClient.put(`${API_ENDPOINTS.auth}/profile`, data);
}

export async function updateProfileImage(image: File): Promise<void> {
  const formData = new FormData();
  formData.append("file", image);
  await apiClient.put(`${API_ENDPOINTS.auth}/profile/image`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deleteProfileImage(): Promise<void> {
  await apiClient.delete(`${API_ENDPOINTS.auth}/profile/image`);
}
