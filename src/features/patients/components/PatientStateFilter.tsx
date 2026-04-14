import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { useStates } from "@/core/location/hooks";
import { MapPin } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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

  // Only fetches when a country is selected — same cached data as LocationSelector (24h stale)
  const { data: states = [], isLoading } = useStates(countryGeonameId ?? null);

  const items = useMemo(
    () => states.map((s) => ({ key: s.geonameId.toString(), label: s.name })),
    [states],
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
