import { FieldError as FieldErrorComponent, Label, TextField } from "@heroui/react";
import { PhoneInput as LibPhoneInput } from "react-international-phone";
import { useTranslation } from "react-i18next";
import "./FormPhoneInput.css";

interface FormPhoneInputProps {
  label?: string;
  error?: { message?: string };
  isRequired?: boolean;
  disabled?: boolean;
  value?: string;
  onChange?: (value: string) => void;
}

export function FormPhoneInput({
  label,
  error,
  isRequired,
  disabled,
  value = "",
  onChange,
}: FormPhoneInputProps) {
  const { t } = useTranslation();

  return (
    <TextField isRequired={isRequired} isInvalid={!!error} className="flex flex-col gap-1.5">
      {label && <Label>{label}</Label>}
      <div dir="ltr" className="phone-input-theme relative">
        <LibPhoneInput
          value={value}
          onChange={(phone) => onChange?.(phone)}
          defaultCountry="eg"
          disabled={disabled}
          inputClassName="w-full h-10 bg-transparent px-3 text-sm outline-none"
          countrySelectorStyleProps={{
            buttonClassName: "flex h-10 items-center border border-border bg-surface-secondary text-sm transition hover:bg-surface-tertiary",
            buttonStyle: { paddingInline: "1rem" },
            buttonContentWrapperStyle: { gap: "0.75rem" },
          }}
        />
      </div>
      {error?.message && (
        <FieldErrorComponent>
          {t(error.message, { defaultValue: error.message })}
        </FieldErrorComponent>
      )}
    </TextField>
  );
}
