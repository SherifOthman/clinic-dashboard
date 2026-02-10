import { Gender } from "@/core/types/common";
import { genderToString } from "@/core/utils/genderUtils";
import { useTranslation } from "react-i18next";

export function useGenderDisplay() {
  const { t } = useTranslation();

  const getTranslatedGenderDisplay = (
    gender: Gender | number | string | null | undefined,
  ): string => {
    const genderString =
      typeof gender === "string" ? gender : genderToString(gender as Gender);

    switch (genderString) {
      case "Male":
        return t("patients.male");
      case "Female":
        return t("patients.female");
      default:
        return t("common.notSpecified");
    }
  };

  return { getTranslatedGenderDisplay };
}
