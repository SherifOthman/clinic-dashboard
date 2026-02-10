import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";

interface PatientTableHeaderProps {
  genderFilter?: number;
  onGenderChange: (gender?: number) => void;
  onCreatePatient: () => void;
}

export function PatientTableHeader({
  genderFilter,
  onGenderChange,
  onCreatePatient,
}: PatientTableHeaderProps) {
  const { t } = useTranslation();

  const handleGenderChange = (selectedKeys: any) => {
    const selectedKey = Array.from(selectedKeys)[0] as string;
    const genderValue =
      selectedKey === "all" ? undefined : parseInt(selectedKey);
    onGenderChange(genderValue);
  };

  return (
    <div className="flex items-center gap-3">
      <Select
        label={t("patients.filterByGender")}
        placeholder={t("patients.allGenders")}
        selectedKeys={
          genderFilter !== undefined
            ? new Set([genderFilter.toString()])
            : new Set(["all"])
        }
        onSelectionChange={handleGenderChange}
        size="sm"
        variant="bordered"
        className="w-48"
        color={genderFilter !== undefined ? "primary" : "default"}
        description={
          genderFilter !== undefined
            ? genderFilter === 0
              ? t("patients.showingFemale")
              : t("patients.showingMale")
            : undefined
        }
      >
        <SelectItem key="all">{t("patients.allGenders")}</SelectItem>
        <SelectItem key="0">{t("patients.female")}</SelectItem>
        <SelectItem key="1">{t("patients.male")}</SelectItem>
      </Select>
      <Button
        color="primary"
        startContent={<UserPlus className="w-4 h-4" />}
        onPress={onCreatePatient}
      >
        {t("patients.addPatient")}
      </Button>
    </div>
  );
}
