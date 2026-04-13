import { useCountries } from "@/core/location/hooks";
import { Globe } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GeonameFilterButton } from "./GeonameFilterButton";

interface PatientCountryFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/** SuperAdmin-only country filter using GeoNames data. */
export function PatientCountryFilter({
  value,
  onChange,
}: PatientCountryFilterProps) {
  const { t } = useTranslation();
  const { data: countries = [], isLoading } = useCountries();

  return (
    <GeonameFilterButton
      value={value}
      onChange={onChange}
      items={countries}
      isLoading={isLoading}
      placeholder={t("patients.filterByCountry")}
      modalTitle={t("patients.filterByCountry")}
      icon={Globe}
    />
  );
}
