import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { useCities } from "@/core/location/hooks";
import { Building2 } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

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

  // Only fetches when a state is selected — same cached data as LocationSelector (24h stale)
  const { data: cities = [], isLoading } = useCities(stateGeonameId ?? null);

  const items = useMemo(
    () => cities.map((c) => ({ key: c.geonameId.toString(), label: c.name })),
    [cities],
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
