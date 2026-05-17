import { apiClient } from "@/core/api";

export async function updateClinicSettings(weekStartDay: number): Promise<void> {
  await apiClient.patch("/clinic/settings", { weekStartDay });
}
