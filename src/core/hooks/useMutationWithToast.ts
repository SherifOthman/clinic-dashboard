import { createErrorHandler } from "@/core/utils/apiErrorHandler";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { useToast } from "./useToast";

interface MutationWithToastOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  /** i18n key for the success toast message */
  successMessage: string;
  /** Query keys to invalidate (refetch) after a successful mutation */
  invalidateKeys?: string[][];
  onSuccess?: (data: TData) => void;
}

/**
 * Wraps React Query's useMutation with standard toast feedback and
 * automatic cache invalidation.
 *
 * Without this hook, every mutation would need to manually:
 *   1. Call showSuccess / showError
 *   2. Call queryClient.invalidateQueries for each affected key
 *
 * This hook handles both, so feature hooks stay clean:
 *
 *   export function useCreatePatient() {
 *     return useMutationWithToast({
 *       mutationFn: patientsApi.create,
 *       successMessage: "toast.patientCreatedSuccessfully",
 *       invalidateKeys: [["patients"]],
 *     });
 *   }
 */
export function useMutationWithToast<TData = unknown, TVariables = void>({
  mutationFn,
  successMessage,
  invalidateKeys = [],
  onSuccess,
}: MutationWithToastOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { showSuccess, showError } = useToast();
  const { t } = useTranslation();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      showSuccess(successMessage);
      // Invalidate all specified query keys so the UI refetches fresh data
      invalidateKeys.forEach((key) =>
        queryClient.invalidateQueries({ queryKey: key }),
      );
      onSuccess?.(data);
    },
    onError: createErrorHandler(showError, t),
  });
}
