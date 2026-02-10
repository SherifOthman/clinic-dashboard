import { Input, InputProps } from "@heroui/input";
import { FieldError } from "react-hook-form";

interface FormInputProps extends InputProps {
  label: string;
  error?: string | FieldError;
  ref?: React.Ref<HTMLInputElement>;
}

/**
 * Reusable form input component
 * Provides consistent form input styling and error handling
 */
export function FormInput({
  label,
  error,
  isInvalid,
  errorMessage,
  ref,
  ...props
}: FormInputProps) {
  const errorText = typeof error === "string" ? error : error?.message;

  return (
    <Input
      ref={ref}
      label={label}
      variant="bordered"
      isInvalid={isInvalid || !!error}
      errorMessage={errorMessage || errorText}
      {...props}
    />
  );
}
