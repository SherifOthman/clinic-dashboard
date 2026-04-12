import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCountries } from "../patientsHooks";

interface PatientCountryFilterProps {
  value: string | undefined;
  onChange: (country: string | null) => void;
}

/** SuperAdmin-only country filter — only rendered when isSuperAdmin=true in PatientsList */
export function PatientCountryFilter({
  value,
  onChange,
}: PatientCountryFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [enabled, setEnabled] = useState(false);
  const { data: countries = [], isLoading } = usePatientCountries(
    true,
    enabled,
  );
  const { getMostUsed, increment } = useMostUsed("patient_country_usage");

  const items = useMemo(
    () =>
      countries.map((c) => ({
        key: c.nameEn || c.nameAr,
        label: isAr ? c.nameAr || c.nameEn : c.nameEn || c.nameAr,
        labelAlt: isAr ? c.nameEn : c.nameAr,
      })),
    [countries, isAr],
  );

  const mostUsedItems = useMemo(
    () => getMostUsed(items, (i) => i.key, 6),
    [items, getMostUsed],
  );

  return (
    <LocationFilterButton
      value={value}
      onChange={onChange}
      items={items}
      mostUsedItems={mostUsedItems}
      onUsed={increment}
      onOpen={() => setEnabled(true)}
      isLoading={isLoading}
      placeholder={t("patients.filterByCountry")}
      modalTitle={t("patients.filterByCountry")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCountries")}
      icon={Globe}
    />
  );
}
