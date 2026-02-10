import type { Control, FieldValues, Path } from "react-hook-form";
import { Controller } from "react-hook-form";
import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import ar from "react-phone-input-2/lang/ar.json";
import "react-phone-input-2/lib/style.css";
import "./PhoneInput.css";

type FormPhoneInputProps<T extends FieldValues> = {
  name: Path<T>;
  control: Control<T>;
  label?: string;
  placeholder?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export function FormPhoneInput<T extends FieldValues>({
  name,
  control,
  label,
  placeholder,
  isRequired,
  isDisabled,
}: FormPhoneInputProps<T>) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const finalLabel = label || t("phoneInput.phoneNumber");
  const finalPlaceholder = placeholder || t("phoneInput.enterPhoneNumber");

  return (
    <Controller
      name={name}
      control={control}
      render={({ field, fieldState }) => (
        <div className="space-y-2">
          {finalLabel && (
            <label className="text-sm font-medium text-foreground">
              {finalLabel}
              {isRequired && <span className="text-danger ml-1">*</span>}
            </label>
          )}

          <div>
            <PhoneInput
              key={i18n.language}
              country="eg"
              value={field.value || ""}
              onChange={(phone) => field.onChange(`+${phone}`)}
              onBlur={field.onBlur}
              disabled={isDisabled}
              placeholder={finalPlaceholder}
              localization={isRTL ? ar : undefined}
              enableSearch
              countryCodeEditable={false}
              searchPlaceholder={
                t("phoneInput.searchCountry") || "Search country"
              }
              inputClass={fieldState.error ? "error" : ""}
              buttonClass={fieldState.error ? "error" : ""}
            />
          </div>

          {fieldState.error && (
            <p className="text-xs text-danger">{fieldState.error.message}</p>
          )}
        </div>
      )}
    />
  );
}
