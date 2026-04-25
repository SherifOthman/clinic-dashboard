import { apiClient } from "@/core/api";
import { API_ENDPOINTS } from "@/core/constants";

export const permissionsApi = {
  getAvailable: async (): Promise<string[]> => {
    const res = await apiClient.get<string[]>(
      `${API_ENDPOINTS.permissions}/available`,
    );
    return res.data;
  },

  getRoleDefaults: async (): Promise<Record<string, string[]>> => {
    const res = await apiClient.get<Record<string, string[]>>(
      `${API_ENDPOINTS.permissions}/role-defaults`,
    );
    return res.data;
  },

  setRoleDefaults: async (
    role: string,
    permissions: string[],
  ): Promise<void> => {
    await apiClient.put(
      `${API_ENDPOINTS.permissions}/role-defaults/${role}`,
      permissions,
    );
  },
};
