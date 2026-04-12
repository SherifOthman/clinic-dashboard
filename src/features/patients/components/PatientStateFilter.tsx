import { LocationFilterButton } from "@/core/components/ui/LocationFilterButton";
import { useMostUsed } from "@/core/hooks/useMostUsed";
import { MapPin } from "lucide-react";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { usePatientStates } from "../patientsHooks";

interface PatientStateFilterProps {
  value: string | undefined;
  onChange: (nameEn: string | null) => void;
  isSuperAdmin?: boolean;
}

export function PatientStateFilter({
  value,
  onChange,
  isSuperAdmin = false,
}: PatientStateFilterProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const [enabled, setEnabled] = useState(false);
  const { data: states = [], isLoading } = usePatientStates(
    isSuperAdmin,
    enabled,
  );
  const { getMostUsed, increment } = useMostUsed("patient_state_usage");

  const items = useMemo(
    () =>
      states.map((s) => ({
        key: s.nameEn || s.nameAr,
        label: isAr ? s.nameAr || s.nameEn : s.nameEn || s.nameAr,
        labelAlt: isAr ? s.nameEn : s.nameAr,
      })),
    [states, isAr],
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
      placeholder={t("patients.filterByState")}
      modalTitle={t("patients.filterByState")}
      mostUsedLabel={t("patients.mostUsed")}
      allItemsLabel={t("patients.allStates")}
      icon={MapPin}
    />
  );
}
