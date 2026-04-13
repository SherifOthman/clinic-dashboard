import { useCities } from "@/core/location/hooks";
import { Building2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GeonameFilterButton } from "./GeonameFilterButton";

interface PatientCityFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
  /** GeoName ID of the selected state — required to load cities */
  stateGeonameId?: number;
}

export function PatientCityFilter({
  value,
  onChange,
  stateGeonameId,
}: PatientCityFilterProps) {
  const { t } = useTranslation();
  const { data: cities = [], isLoading } = useCities(stateGeonameId ?? null);

  return (
    <GeonameFilterButton
      value={value}
      onChange={onChange}
      items={cities}
      isLoading={isLoading}
      placeholder={t("patients.filterByCity")}
      modalTitle={t("patients.filterByCity")}
      icon={Building2}
    />
  );
}
