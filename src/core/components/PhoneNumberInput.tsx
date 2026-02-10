import { useTranslation } from "react-i18next";
import PhoneInput from "react-phone-input-2";
import ar from "react-phone-input-2/lang/ar.json";
import "react-phone-input-2/lib/style.css";
import "./PhoneInput.css";

type PhoneNumberInputProps = {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  isInvalid?: boolean;
  errorMessage?: string;
  isRequired?: boolean;
  isDisabled?: boolean;
};

export function PhoneNumberInput({
  value,
  onChange,
  label,
  placeholder,
  isInvalid,
  errorMessage,
  isRequired,
  isDisabled,
}: PhoneNumberInputProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  const finalLabel = label || t("phoneInput.phoneNumber");
  const finalPlaceholder = placeholder || t("phoneInput.enterPhoneNumber");

  return (
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
          value={value}
          onChange={(phone) => onChange(`+${phone}`)}
          disabled={isDisabled}
          placeholder={finalPlaceholder}
          localization={isRTL ? ar : undefined}
          enableSearch
          countryCodeEditable={false}
          searchPlaceholder={t("phoneInput.searchCountry") || "Search country"}
          inputClass={isInvalid ? "error" : ""}
          buttonClass={isInvalid ? "error" : ""}
        />
      </div>

      {isInvalid && errorMessage && (
        <p className="text-xs text-danger">{errorMessage}</p>
      )}
    </div>
  );
}
