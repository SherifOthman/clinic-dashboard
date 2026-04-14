import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { Building2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCityOptions } from "../patientsHooks";

interface PatientCityFilterProps {
  value: number | undefined;
  stateGeonameId: number | undefined;
  onChange: (geonameId: number | null) => void;
}

export function PatientCityFilter({
  value,
  stateGeonameId,
  onChange,
}: PatientCityFilterProps) {
  const { t } = useTranslation();
  const { getMostUsed, increment } = useMostUsed("patient_city_usage");

  // Fetches distinct cities for this state from actual patient data
  const { data = [], isLoading } = usePatientCityOptions(stateGeonameId);

  const items = useMemo(
    () => data.map((c) => ({ key: c.geonameId.toString(), label: c.name })),
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
      isLoading={isLoading}
      placeholder={t("patients.filterByCity")}
      modalTitle={t("patients.filterByCity")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCities")}
      icon={Building2}
    />
  );
}
