import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { locationApi } from "@/core/location/api";
import { MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCountryIds, usePatientStateIds } from "../patientsHooks";

interface PatientStateFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/**
 * Independent state filter.
 * Fetches distinct state IDs from patients, then resolves names from GeoNames
 * by fetching states for each country that has patients.
 * Works independently — no parent country selection required.
 */
export function PatientStateFilter({
  value,
  onChange,
}: PatientStateFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const lang = isAr ? "ar" : "en";
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_state_usage");

  const { data: stateIds = [], isLoading: idsLoading } =
    usePatientStateIds(enabled);
  const { data: countryIds = [] } = usePatientCountryIds(enabled);

  // Resolve state names by fetching states for each country that has patients
  const [stateNames, setStateNames] = useState<Map<number, string>>(new Map());
  const [namesLoading, setNamesLoading] = useState(false);

  useEffect(() => {
    if (!enabled || stateIds.length === 0 || countryIds.length === 0) return;
    setNamesLoading(true);
    Promise.all(countryIds.map((cId) => locationApi.getStates(cId, lang)))
      .then((results) => {
        const map = new Map<number, string>();
        results.flat().forEach((s) => map.set(s.geonameId, s.name));
        setStateNames(map);
      })
      .finally(() => setNamesLoading(false));
  }, [enabled, stateIds.length, countryIds.length, lang]);

  const items = useMemo(
    () =>
      stateIds.map((id) => ({
        key: id.toString(),
        label: stateNames.get(id) ?? id.toString(),
      })),
    [stateIds, stateNames],
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
      isLoading={idsLoading || namesLoading}
      placeholder={t("patients.filterByState")}
      modalTitle={t("patients.filterByState")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allStates")}
      icon={MapPin}
    />
  );
}
