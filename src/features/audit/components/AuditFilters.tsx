import { Button, Label, ListBox, SearchField, Select } from "@heroui/react";
import { X } from "lucide-react";
import { useTranslation } from "react-i18next";
import { AUDIT_ACTIONS, ENTITY_TYPES } from "../auditConstants";
import { parseDateSafe } from "../auditHelpers";
import type { AuditAction } from "../types";
import { AuditDatePicker } from "./AuditDatePicker";

interface AuditFiltersProps {
  isRTL: boolean;
  userSearch: string;
  onUserSearchChange: (v: string) => void;
  clinicSearch: string;
  onClinicSearchChange: (v: string) => void;
  entityType: string | undefined;
  onEntityTypeChange: (v: string | null) => void;
  action: AuditAction | undefined;
  onActionChange: (v: string | null) => void;
  from: string | undefined;
  onFromChange: (v: string | null) => void;
  to: string | undefined;
  onToChange: (v: string | null) => void;
  onClearAll: () => void;
}

export function AuditFilters({
  isRTL,
  userSearch,
  onUserSearchChange,
  clinicSearch,
  onClinicSearchChange,
  entityType,
  onEntityTypeChange,
  action,
  onActionChange,
  from,
  onFromChange,
  to,
  onToChange,
  onClearAll,
}: AuditFiltersProps) {
  const { t } = useTranslation();

  const hasFilters = !!(
    entityType ||
    action ||
    from ||
    to ||
    userSearch ||
    clinicSearch
  );

  const actionLabel = (a: AuditAction) => t(`audit.actions.${a}`);

  return (
    <div className="flex flex-col gap-3 lg:flex-row lg:flex-wrap lg:items-end">
      <SearchField
        value={userSearch}
        onChange={onUserSearchChange}
        aria-label={t("audit.searchUser")}
        className="w-full lg:w-72"
      >
        <Label className="sr-only">{t("audit.searchUser")}</Label>
        <SearchField.Group>
          <SearchField.SearchIcon className="ms-3" />
          <SearchField.Input placeholder={t("audit.searchUser")} />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <SearchField
        value={clinicSearch}
        onChange={onClinicSearchChange}
        aria-label={t("audit.searchClinic")}
        className="w-full lg:w-64"
      >
        <Label className="sr-only">{t("audit.searchClinic")}</Label>
        <SearchField.Group>
          <SearchField.SearchIcon className="ms-3" />
          <SearchField.Input placeholder={t("audit.searchClinic")} />
          <SearchField.ClearButton />
        </SearchField.Group>
      </SearchField>

      <div className="flex gap-3">
        <Select
          className="flex-1 lg:w-44 lg:flex-none"
          placeholder={t("audit.allEntities")}
          value={entityType ?? null}
          onChange={(v) => onEntityTypeChange(v ? String(v) : null)}
          aria-label={t("audit.filterByEntity")}
        >
          <Select.Trigger>
            <Select.Value className={isRTL ? "text-right" : ""} />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox dir={isRTL ? "rtl" : "ltr"}>
              <ListBox.Item id="" textValue={t("audit.allEntities")}>
                {t("audit.allEntities")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {ENTITY_TYPES.map((e) => (
                <ListBox.Item key={e} id={e} textValue={e}>
                  {e}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="flex-1 lg:w-36 lg:flex-none"
          placeholder={t("audit.allActions")}
          value={action ?? null}
          onChange={(v) => onActionChange(v ? String(v) : null)}
          aria-label={t("audit.filterByAction")}
        >
          <Select.Trigger>
            <Select.Value className={isRTL ? "text-right" : ""} />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox dir={isRTL ? "rtl" : "ltr"}>
              <ListBox.Item id="" textValue={t("audit.allActions")}>
                {t("audit.allActions")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              {AUDIT_ACTIONS.map((a) => (
                <ListBox.Item key={a} id={a} textValue={actionLabel(a)}>
                  {actionLabel(a)}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              ))}
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <div className="flex gap-3">
        <div className="w-44">
          <AuditDatePicker
            label={t("filters.from")}
            value={parseDateSafe(from ?? null)}
            onChange={(d) => onFromChange(d ? d.toString() : null)}
          />
        </div>
        <div className="w-44">
          <AuditDatePicker
            label={t("filters.to")}
            value={parseDateSafe(to ?? null)}
            onChange={(d) => onToChange(d ? d.toString() : null)}
          />
        </div>
      </div>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onPress={onClearAll}
          className="shrink-0"
        >
          <X className="h-4 w-4" />
          {t("filters.clearAll")}
        </Button>
      )}
    </div>
  );
}
