import { apiClient } from "@/core/api";

export const settingsApi = {
  updateClinicSettings: (weekStartDay: number): Promise<void> =>
    apiClient.patch("/clinic/settings", { weekStartDay }),
};
