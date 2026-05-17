import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { Input } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BranchDto } from "../../branches/branchesApi";
import type { AppointmentDto, DoctorForBranch } from "../types";
import type { useAppointmentsTableState } from "../appointmentsTableState";

type AppointmentsState = ReturnType<typeof useAppointmentsTableState>["state"];
type UpdateFn = ReturnType<typeof useAppointmentsTableState>["update"];

interface AppointmentsToolbarProps {
  state: AppointmentsState;
  onUpdate: UpdateFn;
  isDateUnavailable?: (date: DateValue) => boolean;
  branches: BranchDto[];
  activeBranchId: string | null;
  onBranchChange: (branchId: string | undefined) => void;
  doctors: DoctorForBranch[];
  effectiveDoctorId: string | undefined;
  appointments: AppointmentDto[];
}

export function AppointmentsToolbar({
  state, onUpdate, isDateUnavailable,
  branches, activeBranchId, onBranchChange,
  doctors, effectiveDoctorId,
  appointments,
}: AppointmentsToolbarProps) {
  const { t } = useTranslation();

  const handleDateChange = (d: DateValue | null) => {
    if (!d) return;
    onUpdate({ dateStr: `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}` });
  };

  // Build unique visit type options from loaded appointments
  const visitTypeOptions = useMemo(() => {
    const seen = new Set<string>();
    return appointments
      .filter((a) => a.visitTypeName && !seen.has(a.visitTypeName) && seen.add(a.visitTypeName))
      .map((a) => ({ id: a.visitTypeName, label: a.visitTypeName }));
  }, [appointments]);

  return (
    <div className="mb-5 flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <AppDatePicker
          value={parseDate(state.dateStr)}
          onChange={handleDateChange}
          isDateUnavailable={isDateUnavailable}
          ariaLabel={t("common.fields.date")}
          className="w-44 min-w-[11rem]"
        />

        {branches.length > 1 && (
          <FilterSelect
            value={activeBranchId ?? undefined}
            onChange={onBranchChange}
            options={branches.map((b) => ({ id: b.id, label: b.name }))}
            placeholder={t("appointments.selectBranch")}
            ariaLabel={t("appointments.selectBranch")}
            className="w-44"
          />
        )}

        {doctors.length > 1 && (
          <FilterSelect
            value={effectiveDoctorId}
            onChange={(v) => onUpdate({ doctorId: v })}
            options={doctors.map((d) => ({ id: d.doctorInfoId, label: d.fullName }))}
            placeholder={t("appointments.selectDoctor")}
            ariaLabel={t("appointments.selectDoctor")}
            className="w-48"
          />
        )}

        {visitTypeOptions.length > 0 && (
          <FilterSelect
            value={state.visitType || undefined}
            onChange={(v) => onUpdate({ visitType: v ?? "" })}
            options={visitTypeOptions}
            placeholder={t("appointments.allVisitTypes")}
            ariaLabel={t("appointments.filterByVisitType")}
            className="w-44"
          />
        )}

        <FilterSelect
          value={state.payment || undefined}
          onChange={(v) => onUpdate({ payment: v ?? "" })}
          options={[
            { id: "unpaid", label: t("appointments.filterUnpaid") },
            { id: "paid",   label: t("appointments.filterPaid")   },
          ]}
          placeholder={t("appointments.allPayments")}
          ariaLabel={t("appointments.filterByPayment")}
          className="w-40"
        />
      </div>

      <Input
        value={state.searchTerm}
        onChange={(e) => onUpdate({ searchTerm: e.target.value })}
        placeholder={t("appointments.searchPlaceholder")}
        aria-label={t("appointments.searchPlaceholder")}
        fullWidth
      />
    </div>
  );
}
