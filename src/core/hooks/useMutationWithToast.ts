import { getErrorMessage } from "@/core/utils/apiErrorHandler";
import { toast } from "@heroui/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";

interface MutationWithToastOptions<TData, TVariables> {
  mutationFn: (variables: TVariables) => Promise<TData>;
  successMessage?: string;
  invalidateKeys?: string[][];
  onSuccess?: (data: TData) => void;
}

export function useMutationWithToast<TData = unknown, TVariables = void>({
  mutationFn,
  successMessage,
  invalidateKeys = [],
  onSuccess,
}: MutationWithToastOptions<TData, TVariables>) {
  const queryClient = useQueryClient();
  const { t } = useTranslation();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      if (successMessage) toast.success(t(successMessage));
      invalidateKeys.forEach((key) => queryClient.invalidateQueries({ queryKey: key }));
      onSuccess?.(data);
    },
    onError: (error) => toast.danger(getErrorMessage(error, t)),
  });
}
