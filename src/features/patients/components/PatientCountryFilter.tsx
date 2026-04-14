import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { useCountries } from "@/core/location/hooks";
import { Globe } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface PatientCountryFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

export function PatientCountryFilter({
  value,
  onChange,
}: PatientCountryFilterProps) {
  const { t } = useTranslation();
  const { getMostUsed, increment } = useMostUsed("patient_country_usage");

  // Reuses the same cached data as the LocationSelector form component (24h stale)
  const { data: countries = [], isLoading } = useCountries();

  const items = useMemo(
    () =>
      countries.map((c) => ({ key: c.geonameId.toString(), label: c.name })),
    [countries],
  );

  const mostUsedItems = useMemo(
    () => getMostUsed(items, (i) => i.key, 6),
    [items, getMostUsed],
  );

  return (
    <LocationFilterButton
      value={value?.toString()}
      onChange={(key) => onChange(key ? parseInt(key) : null)}
      items={items}
      mostUsedItems={mostUsedItems}
      onUsed={increment}
      isLoading={isLoading}
      placeholder={t("patients.filterByCountry")}
      modalTitle={t("patients.filterByCountry")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCountries")}
      icon={Globe}
    />
  );
}
