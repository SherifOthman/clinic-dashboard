import { useStates } from "@/core/location/hooks";
import { MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import { GeonameFilterButton } from "./GeonameFilterButton";

interface PatientStateFilterProps {
  value: number | undefined;
  onChange: (geonameId: number | null) => void;
  /** GeoName ID of the selected country — required to load states */
  countryGeonameId?: number;
}

export function PatientStateFilter({
  value,
  onChange,
  countryGeonameId,
}: PatientStateFilterProps) {
  const { t } = useTranslation();
  const { data: states = [], isLoading } = useStates(countryGeonameId ?? null);

  return (
    <GeonameFilterButton
      value={value}
      onChange={onChange}
      items={states}
      isLoading={isLoading}
      placeholder={t("patients.filterByState")}
      modalTitle={t("patients.filterByState")}
      icon={MapPin}
    />
  );
}
