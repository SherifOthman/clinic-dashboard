import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientLocationFilter } from "../patientsHooks";

interface PatientStateFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/** Independent state filter — shows only states that have patients. */
export function PatientStateFilter({
  value,
  onChange,
}: PatientStateFilterProps) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_state_usage");

  const { data, isLoading } = usePatientLocationFilter(enabled);

  const items = useMemo(
    () =>
      (data?.states ?? []).map((s) => ({
        key: s.geonameId.toString(),
        label: s.name,
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
      placeholder={t("patients.filterByState")}
      modalTitle={t("patients.filterByState")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allStates")}
      icon={MapPin}
    />
  );
}
