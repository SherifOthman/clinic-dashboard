import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { locationApi } from "@/core/location/api";
import { Globe } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCountryIds } from "../patientsHooks";

interface PatientCountryFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
}

/** SuperAdmin-only country filter — shows only countries that have patients. */
export function PatientCountryFilter({
  value,
  onChange,
}: PatientCountryFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const lang = isAr ? "ar" : "en";
  const [enabled, setEnabled] = useState(false);
  const { getMostUsed, increment } = useMostUsed("patient_country_usage");

  const { data: countryIds = [], isLoading: idsLoading } =
    usePatientCountryIds(enabled);

  const [countryNames, setCountryNames] = useState<Map<number, string>>(
    new Map(),
  );
  const [namesLoading, setNamesLoading] = useState(false);

  useEffect(() => {
    if (!enabled || countryIds.length === 0) return;
    setNamesLoading(true);
    locationApi
      .getCountries(lang)
      .then((countries) => {
        const map = new Map<number, string>();
        countries.forEach((c) => map.set(c.geonameId, c.name));
        setCountryNames(map);
      })
      .finally(() => setNamesLoading(false));
  }, [enabled, countryIds.length, lang]);

  const items = useMemo(
    () =>
      countryIds.map((id) => ({
        key: id.toString(),
        label: countryNames.get(id) ?? id.toString(),
      })),
    [countryIds, countryNames],
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
      placeholder={t("patients.filterByCountry")}
      modalTitle={t("patients.filterByCountry")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allCountries")}
      icon={Globe}
    />
  );
}
