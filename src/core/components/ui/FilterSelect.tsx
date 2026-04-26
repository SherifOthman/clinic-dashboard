import { ListBox, Select } from "@heroui/react";
import { useTranslation } from "react-i18next";

export interface FilterOption {
  id: string;
  label: string;
}

interface FilterSelectProps {
  /** Current selected value (empty string = "all") */
  value: string | undefined;
  onChange: (value: string | undefined) => void;
  options: FilterOption[];
  /** Shown when nothing is selected — acts as the "all" option label */
  placeholder: string;
  ariaLabel: string;
  className?: string;
}

/**
 * A thin wrapper around HeroUI Select for filter dropdowns.
 * Handles the "all" option automatically — selecting it calls onChange(undefined).
 *
 * Before:
 *   <Select className="w-full sm:w-48" placeholder={t("staff.allRoles")} value={roleFilter}
 *     onChange={(v) => updateStaffState({ role: v ? String(v) : undefined })}
 *     aria-label={t("staff.filterByRole")}>
 *     <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
 *     <Select.Popover>
 *       <ListBox dir="ltr">
 *         <ListBox.Item id="" textValue={t("staff.allRoles")}>{t("staff.allRoles")}<ListBox.ItemIndicator /></ListBox.Item>
 *         <ListBox.Item id="Doctor" textValue={t("staff.roles.Doctor")}>{t("staff.roles.Doctor")}<ListBox.ItemIndicator /></ListBox.Item>
 *         ...
 *       </ListBox>
 *     </Select.Popover>
 *   </Select>
 *
 * After:
 *   <FilterSelect value={roleFilter} onChange={(v) => updateStaffState({ role: v })}
 *     options={[{ id: "Doctor", label: t("staff.roles.Doctor") }, ...]}
 *     placeholder={t("staff.allRoles")} ariaLabel={t("staff.filterByRole")} />
 */
export function FilterSelect({
  value,
  onChange,
  options,
  placeholder,
  ariaLabel,
  className = "w-full sm:w-48",
}: FilterSelectProps) {
  const { i18n } = useTranslation();
  const isRTL = i18n.language === "ar";

  return (
    <Select
      className={className}
      placeholder={placeholder}
      value={value ?? ""}
      onChange={(v) => onChange(v ? String(v) : undefined)}
      aria-label={ariaLabel}
    >
      <Select.Trigger>
        <Select.Value className={isRTL ? "text-right" : ""} />
        <Select.Indicator />
      </Select.Trigger>
      <Select.Popover>
        <ListBox dir="ltr">
          <ListBox.Item id="" textValue={placeholder}>
            {placeholder}
            <ListBox.ItemIndicator />
          </ListBox.Item>
          {options.map((opt) => (
            <ListBox.Item key={opt.id} id={opt.id} textValue={opt.label}>
              {opt.label}
              <ListBox.ItemIndicator />
            </ListBox.Item>
          ))}
        </ListBox>
      </Select.Popover>
    </Select>
  );
}
