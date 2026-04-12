import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { Building2 } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientCities } from "../patientsHooks";

interface PatientCityFilterProps {
  value: string | undefined;
  onChange: (city: string | null) => void;
  isSuperAdmin?: boolean;
}

export function PatientCityFilter({
  value,
  onChange,
  isSuperAdmin = false,
}: PatientCityFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [enabled, setEnabled] = useState(false);
  const { data: cities = [], isLoading } = usePatientCities(
    isSuperAdmin,
    enabled,
  );
  const { getMostUsed, increment } = useMostUsed("patient_city_usage");

  const items = useMemo(
    () =>
      cities.map((c) => ({
        key: c.nameEn || c.nameAr,
        label: isAr ? c.nameAr || c.nameEn : c.nameEn || c.nameAr,
        labelAlt: isAr ? c.nameEn : c.nameAr,
      })),
    [cities, isAr],
  );

  const mostUsedItems = useMemo(
    () => getMostUsed(items, (i) => i.key, 6),
    [items, getMostUsed],
  );

  return (
    <LocationFilterButton
      value={value}
      onChange={onChange}
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
