import type { Key } from "@heroui/react";
import {
  Autocomplete,
  FieldError as FieldErrorComponent,
  Input,
  Label,
  ListBox,
  SearchField,
  TextField,
  useFilter,
} from "@heroui/react";
import { parsePhoneNumber } from "libphonenumber-js/max";
import { ChevronDown, Search } from "lucide-react";
import { useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  defaultCountries,
  FlagImage,
  parseCountry,
} from "react-international-phone";

interface FormPhoneInputProps {
  label?: string;
  error?: { message?: string };
  isRequired?: boolean;
  disabled?: boolean;
  value?: string; // E.164 e.g. "+201098021259"
  onChange?: (value: string) => void;
}

function parseE164(e164: string) {
  if (e164) {
    try {
      const parsed = parsePhoneNumber(e164);
      return {
        iso2: parsed.country?.toLowerCase() ?? "eg",
        dialCode: String(parsed.countryCallingCode),
        local: parsed.formatNational().replace(/[\s\-().]/g, ""),
      };
    } catch {}
  }
  return { iso2: "eg", dialCode: "20", local: "" };
}

export function FormPhoneInput({
  label,
  error,
  isRequired,
  disabled,
  value,
  onChange,
}: FormPhoneInputProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";
  const { contains } = useFilter({ sensitivity: "base" });

  // Initialize from value prop once — use a ref to track the last external value
  // so we only re-sync when the form resets (value changes to something different
  // from what we'd emit ourselves)
  const lastEmitted = useRef<string>("");
  const initial = parseE164(value || "");
  const [iso2, setIso2] = useState(initial.iso2);
  const [dialCode, setDialCode] = useState(initial.dialCode);
  const [localNumber, setLocalNumber] = useState(initial.local);

  // Only sync inward when value changes externally (form reset / edit load)
  // — not when we caused the change ourselves
  if (value !== undefined && value !== lastEmitted.current) {
    const s = parseE164(value);
    if (s.iso2 !== iso2 || s.local !== localNumber) {
      setIso2(s.iso2);
      setDialCode(s.dialCode);
      setLocalNumber(s.local);
    }
    lastEmitted.current = value;
  }

  const emit = (dc: string, local: string) => {
    const digits = local.replace(/\D/g, "");
    const e164 = `+${dc}${digits}`;
    lastEmitted.current = e164;
    onChange?.(e164);
  };

  const countryDisplayNames = new Intl.DisplayNames([isArabic ? "ar" : "en"], {
    type: "region",
  });

  const getCountryName = (iso2: string, fallback: string) => {
    try {
      return countryDisplayNames.of(iso2.toUpperCase()) ?? fallback;
    } catch {
      return fallback;
    }
  };

  const handleCountryChange = (val: Key | null) => {
    if (!val) return;
    const cd = defaultCountries.map(parseCountry).find((c) => c.iso2 === val);
    if (!cd) return;
    setIso2(cd.iso2);
    setDialCode(cd.dialCode);
    emit(cd.dialCode, localNumber);
  };

  const handleLocalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const digits = e.target.value.replace(/\D/g, "");
    setLocalNumber(digits);
    emit(dialCode, digits);
  };

  return (
    <TextField isRequired={isRequired} isInvalid={!!error}>
      {label && <Label>{label}</Label>}

      <div className="flex w-full gap-2">
        {/* Country selector */}
        <Autocomplete
          value={iso2}
          onChange={handleCountryChange}
          isDisabled={disabled}
          className="w-28 shrink-0"
          aria-label={t("phoneInput.country")}
        >
          <Autocomplete.Trigger>
            <Autocomplete.Value dir="ltr">
              <div className="flex items-center gap-1.5">
                <FlagImage
                  iso2={iso2}
                  style={{ width: 20, height: 15, display: "block" }}
                />
                <span className="text-sm font-medium">+{dialCode}</span>
              </div>
            </Autocomplete.Value>
            <Autocomplete.Indicator>
              <ChevronDown size={20} />
            </Autocomplete.Indicator>
          </Autocomplete.Trigger>

          <Autocomplete.Popover dir={isArabic ? "rtl" : "ltr"}>
            <Autocomplete.Filter filter={contains}>
              <SearchField>
                <SearchField.Group>
                  <SearchField.SearchIcon>
                    <Search />
                  </SearchField.SearchIcon>
                  <SearchField.Input placeholder={t("common.search")} />
                </SearchField.Group>
              </SearchField>
              <ListBox className="max-h-60">
                {defaultCountries.map((c) => {
                  const cd = parseCountry(c);
                  const name = getCountryName(cd.iso2, cd.name);
                  return (
                    <ListBox.Item
                      key={cd.iso2}
                      id={cd.iso2}
                      textValue={`${name} +${cd.dialCode}`}
                    >
                      <div className="flex items-center gap-2 py-1">
                        <FlagImage
                          iso2={cd.iso2}
                          style={{ width: 20, height: 15, display: "block" }}
                        />
                        <span className="flex-1 text-sm">{name}</span>
                        <span className="text-default-500 text-xs">
                          +{cd.dialCode}
                        </span>
                      </div>
                    </ListBox.Item>
                  );
                })}
              </ListBox>
            </Autocomplete.Filter>
          </Autocomplete.Popover>
        </Autocomplete>

        {/* Local number — digits only, no country code */}
        <Input
          type="tel"
          inputMode="numeric"
          disabled={disabled}
          value={localNumber}
          onChange={handleLocalChange}
          placeholder={t("phoneInput.enterPhoneNumber")}
          className="w-full flex-1"
          dir="ltr"
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

