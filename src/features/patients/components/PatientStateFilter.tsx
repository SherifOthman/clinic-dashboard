import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { usePatientStateOptions } from "../patientsHooks";

interface PatientStateFilterProps {
  value: number | undefined;
  countryGeonameId: number | undefined;
  onChange: (geonameId: number | null) => void;
}

export function PatientStateFilter({
  value,
  countryGeonameId,
  onChange,
}: PatientStateFilterProps) {
  const { t } = useTranslation();
  const { getMostUsed, increment } = useMostUsed("patient_state_usage");

  // Fetches distinct states for this country from actual patient data
  // Automatically fetches when countryGeonameId is set (no lazy flag needed — parent controls visibility)
  const { data = [], isLoading } = usePatientStateOptions(countryGeonameId);

  const items = useMemo(
    () => data.map((s) => ({ key: s.geonameId.toString(), label: s.name })),
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
      placeholder={t("patients.filterByState")}
      modalTitle={t("patients.filterByState")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allStates")}
      icon={MapPin}
    />
  );
}
