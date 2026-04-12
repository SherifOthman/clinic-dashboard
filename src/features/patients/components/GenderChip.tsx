import { Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";

interface GenderChipProps {
  gender: string;
  size?: "sm" | "md";
}

/**
 * Single source of truth for gender chip styling.
 * Male  → accent (blue)
 * Female → pink (custom soft)
 * Used in both the table row and the detail dialog.
 */
export function GenderChip({ gender, size = "sm" }: GenderChipProps) {
  const { t } = useTranslation();
  const isFemale = gender === "Female";

  if (isFemale) {
    return (
      <Chip
        size={size}
        variant="soft"
        className="bg-pink-500/15 text-pink-500 dark:text-pink-400"
      >
        {t("common.fields.female")}
      </Chip>
    );
  }

  return (
    <Chip size={size} variant="soft" color="accent">
      {t("common.fields.male")}
    </Chip>
  );
}
