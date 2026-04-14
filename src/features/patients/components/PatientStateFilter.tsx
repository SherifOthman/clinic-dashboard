import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientLocationFilter } from "../patientsHooks";

interface PatientStateFilterProps {
  value: number | undefined;
  /** When set, only states belonging to this country are shown. */
  countryGeonameId: number | undefined;
  onChange: (geonameId: number | null) => void;
}

export function PatientStateFilter({
  value,
  countryGeonameId,
  onChange,
}: PatientStateFilterProps) {
  const { t } = useTranslation();
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_state_usage");
  const { data, isLoading } = usePatientLocationFilter(enabled);

  // Filter states by selected country (client-side — data already loaded)
  const items = useMemo(() => {
    const states = data?.states ?? [];
    const filtered = countryGeonameId
      ? states.filter((s) => s.countryGeonameId === countryGeonameId)
      : states;
    return filtered.map((s) => ({
      key: s.geonameId.toString(),
      label: s.name,
    }));
  }, [data, countryGeonameId]);

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
