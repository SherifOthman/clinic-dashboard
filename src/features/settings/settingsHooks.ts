import { useMutationWithToast } from "@/core/hooks/useMutationWithToast";
import { updateClinicSettings } from "./settingsApi";

export function useUpdateClinicSettings() {
  return useMutationWithToast<void, { weekStartDay: number }>({
    mutationFn: ({ weekStartDay }) => updateClinicSettings(weekStartDay),
    successMessage: "toast.settingsSaved",
    invalidateKeys: [["auth", "me"]],
  });
}
