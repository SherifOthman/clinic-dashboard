import {
  FieldError as FieldErrorComponent,
  Input,
  Label,
  TextField,
} from "@heroui/react";
import type { FieldError } from "react-hook-form";

interface FormInputProps extends React.ComponentProps<typeof Input> {
  label: string;
  error?: FieldError;
  isRequired?: boolean;
  /** When true, blocks digit characters via keyboard and paste events */
  noNumbers?: boolean;
}

/**
 * Base text input wrapped in HeroUI's TextField for consistent label + error display.
 *
 * noNumbers: intercepts keyDown and paste events to prevent digit entry.
 * Used for patient full name where numbers are not allowed.
 */

export function FormInput({
  label,
  error,
  isRequired,
  noNumbers,
  onKeyDown,
  onPaste,
  ...props
}: FormInputProps) {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (noNumbers && /^\d$/.test(e.key)) e.preventDefault();
    onKeyDown?.(e);
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    if (noNumbers) {
      const text = e.clipboardData.getData("text");
      if (/\d/.test(text)) e.preventDefault();
    }
    onPaste?.(e);
  };

  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      <Label>{label}</Label>
      <Input
        {...props}
        onKeyDown={noNumbers ? handleKeyDown : onKeyDown}
        onPaste={noNumbers ? handlePaste : onPaste}
      />
      {error?.message && (
        <FieldErrorComponent>{error.message}</FieldErrorComponent>
      )}
    </TextField>
  );
}
