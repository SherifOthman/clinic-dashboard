import {
  Controller,
  type Control,
  type FieldPath,
  type FieldValues,
} from "react-hook-form";
import { FormInput } from "./FormInput";

interface FormInputFieldProps<T extends FieldValues> {
  name: FieldPath<T>;
  control: Control<T>;
  label: string;
  isRequired?: boolean;
  /** When true, blocks digit input via keyboard and paste */
  noNumbers?: boolean;
  type?: string;
  placeholder?: string;
  disabled?: boolean;
}

/**
 * Controller-wrapped FormInput for use with react-hook-form.
 *
 * Why use this instead of bare FormInput + {...register()}?
 * `register()` uses uncontrolled inputs — the DOM holds the value.
 * `Controller` makes the field controlled (React holds the value),
 * which means form.reset() and defaultValues changes are reflected
 * in the UI immediately. Use this whenever you need programmatic
 * value updates (e.g. demo login buttons, draft restoration).
 */
export function FormInputField<T extends FieldValues>({
  name,
  control,
  label,
  isRequired,
  noNumbers,
  type,
  placeholder,
  disabled,
}: FormInputFieldProps<T>) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <FormInput
          {...field}
          label={label}
          error={fieldState.error}
          isRequired={isRequired}
          noNumbers={noNumbers}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
        />
      )}
    />
  );
}
