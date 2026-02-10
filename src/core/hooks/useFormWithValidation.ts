import { logger } from "@/core/services/logger";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import {
  useForm,
  type FieldValues,
  type UseFormProps,
  type UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";
import { type ZodSchema } from "zod";

interface UseFormWithValidationOptions<T extends FieldValues>
  extends Omit<UseFormProps<T>, "resolver"> {
  schema: ZodSchema<T>;
  serverError?: any;
}

export function useFormWithValidation<T extends FieldValues>({
  schema,
  serverError,
  ...formOptions
}: UseFormWithValidationOptions<T>): UseFormReturn<T> {
  const { t } = useTranslation();
  const form = useForm<T>({
    resolver: zodResolver(schema as any) as any,
    ...formOptions,
  }) as UseFormReturn<T>;

  const { setError } = form;

  useEffect(() => {
    if (serverError) {
      logger.warn(
        "Server validation errors received",
        { serverError },
        "FormValidation",
      );
      setServerErrors(serverError, setError);
    }
  }, [serverError, setError, t]);

  return form;
}
