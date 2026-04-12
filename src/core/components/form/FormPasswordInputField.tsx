import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormPasswordInput } from "./FormPasswordInput";

interface FormPasswordInputFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  isRequired?: boolean;
  placeholder?: string;
}

/**
 * Controller-wrapped FormPasswordInput.
 * Use when the password field needs to reflect reset()/defaultValues in the UI
 * (e.g. demo login buttons that call reset() to fill credentials).
 */
export function FormPasswordInputField<T extends FieldValues>({
  name,
  control,
  label,
  isRequired,
  placeholder,
}: FormPasswordInputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormPasswordInput
          {...field}
          label={label}
          error={fieldState.error}
          isRequired={isRequired}
          placeholder={placeholder}
        />
      )}
    />
  );
}
