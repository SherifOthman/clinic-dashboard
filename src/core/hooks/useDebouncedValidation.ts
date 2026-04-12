import { useEffect } from "react";
import type {
  FieldValues,
  Path,
  UseFormClearErrors,
  UseFormSetError,
} from "react-hook-form";
import { useDebounce } from "./useDebounce";

interface ValidationResult {
  isAvailable: boolean;
}

interface UseDebouncedValidationOptions<T extends FieldValues> {
  fieldName: Path<T>;
  fieldValue: string | undefined;
  validationHook: (
    value: string,
    enabled: boolean,
  ) => { data?: ValidationResult };
  setError: UseFormSetError<T>;
  clearErrors: UseFormClearErrors<T>;
  errorMessage: string;
  delay?: number;
}

export function useDebouncedValidation<T extends FieldValues>({
  fieldName,
  fieldValue,
  validationHook,
  setError,
  clearErrors,
  errorMessage,
  delay = 500,
}: UseDebouncedValidationOptions<T>) {
  const debouncedValue = useDebounce(fieldValue || "", delay);
  const { data: validationResult } = validationHook(
    debouncedValue,
    !!debouncedValue,
  );

  useEffect(() => {
    if (validationResult && !validationResult.isAvailable) {
      setError(fieldName, {
        type: "manual",
        message: errorMessage,
      });
    } else if (validationResult && validationResult.isAvailable) {
      clearErrors(fieldName);
    }
  }, [validationResult, fieldName, setError, clearErrors, errorMessage]);
}
