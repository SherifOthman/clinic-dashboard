import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { settingsApi } from "./settingsApi";

export function useUpdateClinicSettings() {
  return useMutationWithToast<void, { weekStartDay: number }>({
    mutationFn: ({ weekStartDay }) => settingsApi.updateClinicSettings(weekStartDay),
    successMessage: "toast.settingsSaved",
    invalidateKeys: [["auth", "me"]], // re-fetch /me so weekStartDay updates everywhere
  });
}
