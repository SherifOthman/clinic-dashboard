import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { Globe } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientLocationFilter } from "../patientsHooks";

interface PatientCountryFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/** SuperAdmin-only country filter — shows only countries that have patients. */
export function PatientCountryFilter({
  value,
  onChange,
}: PatientCountryFilterProps) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_country_usage");

  const { data, isLoading } = usePatientLocationFilter(enabled);

  const items = useMemo(
    () =>
      (data?.countries ?? []).map((c) => ({
        key: c.geonameId.toString(),
        label: c.name,
      })),
    [data],
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
