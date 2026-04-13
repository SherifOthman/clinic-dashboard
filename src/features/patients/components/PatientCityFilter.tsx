import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientLocationFilter } from "../patientsHooks";

interface PatientCityFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/** Independent city filter — shows only cities that have patients. */
export function PatientCityFilter({ value, onChange }: PatientCityFilterProps) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_city_usage");

  const { data, isLoading } = usePatientLocationFilter(enabled);

  const items = useMemo(
    () =>
      (data?.cities ?? []).map((c) => ({
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
      placeholder={t("patients.filterByCity")}
      modalTitle={t("patients.filterByCity")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCities")}
      icon={Building2}
    />
  );
}
