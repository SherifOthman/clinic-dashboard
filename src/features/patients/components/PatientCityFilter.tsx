import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { locationApi } from "@/core/location/api";
import { Building2 } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCityIds, usePatientStateIds } from "../patientsHooks";

interface PatientCityFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/**
 * Independent city filter.
 * Fetches distinct city IDs from patients, then resolves names from GeoNames
 * by fetching cities for each state that has patients.
 */
export function PatientCityFilter({ value, onChange }: PatientCityFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const lang = isAr ? "ar" : "en";
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_city_usage");

  const { data: cityIds = [], isLoading: idsLoading } =
    usePatientCityIds(enabled);
  const { data: stateIds = [] } = usePatientStateIds(enabled);

  const [cityNames, setCityNames] = useState<Map<number, string>>(new Map());
  const [namesLoading, setNamesLoading] = useState(false);

  useEffect(() => {
    if (!enabled || cityIds.length === 0 || stateIds.length === 0) return;
    setNamesLoading(true);
    Promise.all(stateIds.map((sId) => locationApi.getCities(sId, lang)))
      .then((results) => {
        const map = new Map<number, string>();
        results.flat().forEach((c) => map.set(c.geonameId, c.name));
        setCityNames(map);
      })
      .finally(() => setNamesLoading(false));
  }, [enabled, cityIds.length, stateIds.length, lang]);

  const items = useMemo(
    () =>
      cityIds.map((id) => ({
        key: id.toString(),
        label: cityNames.get(id) ?? id.toString(),
      })),
    [cityIds, cityNames],
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
      placeholder={t("patients.filterByCity")}
      modalTitle={t("patients.filterByCity")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCities")}
      icon={Building2}
    />
  );
}
