import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { Button, Input, Tooltip } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import { LayoutGrid, LayoutList } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { BranchDto } from "../../branches/branchesApi";
import type { DoctorForBranch, ViewMode } from "../types";

interface AppointmentsToolbarProps {
  dateStr: string;
  onDateChange: (dateStr: string) => void;
  branches: BranchDto[];
  activeBranchId: string | null;
  onBranchChange: (branchId: string | undefined) => void;
  doctors: DoctorForBranch[];
  effectiveDoctorId: string | undefined;
  onDoctorChange: (doctorId: string | undefined) => void;
  viewMode: ViewMode;
  manualViewMode: ViewMode | null;
  onViewModeChange: (mode: ViewMode) => void;
  onResetViewMode: () => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
}

export function AppointmentsToolbar({
  dateStr, onDateChange,
  branches, activeBranchId, onBranchChange,
  doctors, effectiveDoctorId, onDoctorChange,
  viewMode, manualViewMode, onViewModeChange, onResetViewMode,
  searchTerm, onSearchChange,
}: AppointmentsToolbarProps) {
  const { t } = useTranslation();
  const isSingle = viewMode === "single";

  const handleDateChange = (d: import("@internationalized/date").DateValue | null) => {
    if (!d) return;
    onDateChange(`${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`);
  };

  return (
    <div className="mb-5 flex flex-wrap items-center gap-3">
      {/* Date picker */}
      <AppDatePicker
        value={parseDate(dateStr)}
        onChange={handleDateChange}
        ariaLabel={t("common.fields.date")}
        className="w-44 min-w-[11rem]"
      />

      {/* Search — compact, right next to date */}
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("appointments.searchPlaceholder")}
        aria-label={t("appointments.searchPlaceholder")}
        className="w-52"
      />

      {/* Branch selector */}
      {branches.length > 1 && (
        <FilterSelect
          value={activeBranchId ?? undefined}
          onChange={(v) => onBranchChange(v)}
          options={branches.map((b) => ({ id: b.id, label: b.name }))}
          placeholder={t("appointments.selectBranch")}
          ariaLabel={t("appointments.selectBranch")}
          className="w-44"
        />
      )}

      {/* Doctor selector — single mode only */}
      {isSingle && doctors.length > 1 && (
        <FilterSelect
          value={effectiveDoctorId}
          onChange={(v) => onDoctorChange(v)}
          options={doctors.map((d) => ({ id: d.doctorInfoId, label: d.fullName }))}
          placeholder={t("appointments.selectDoctor")}
          ariaLabel={t("appointments.selectDoctor")}
          className="w-48"
        />
      )}

      {/* Layout toggle */}
      <div className="ms-auto flex gap-1">
        <Tooltip delay={300}>
          <Tooltip.Trigger>
            <Button size="sm" variant={viewMode === "multi" ? "primary" : "outline"} isIconOnly
              onPress={() => onViewModeChange("multi")} aria-label={t("appointments.multiDoctorView")}>
              <LayoutGrid className="h-4 w-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content><p>{t("appointments.multiDoctorView")}</p></Tooltip.Content>
        </Tooltip>

        <Tooltip delay={300}>
          <Tooltip.Trigger>
            <Button size="sm" variant={viewMode === "single" ? "primary" : "outline"} isIconOnly
              onPress={() => onViewModeChange("single")} aria-label={t("appointments.singleDoctorView")}>
              <LayoutList className="h-4 w-4" />
            </Button>
          </Tooltip.Trigger>
          <Tooltip.Content><p>{t("appointments.singleDoctorView")}</p></Tooltip.Content>
        </Tooltip>

        {manualViewMode && (
          <Tooltip delay={300}>
            <Tooltip.Trigger>
              <Button size="sm" variant="ghost" onPress={onResetViewMode} className="text-xs text-muted">
                {t("appointments.autoView")}
              </Button>
            </Tooltip.Trigger>
            <Tooltip.Content><p>{t("appointments.autoViewDesc")}</p></Tooltip.Content>
          </Tooltip>
        )}
      </div>
    </div>
  );
}
