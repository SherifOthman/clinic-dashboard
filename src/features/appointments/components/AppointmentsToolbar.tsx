import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { Input } from "@heroui/react";
import { parseDate } from "@internationalized/date";
import type { DateValue } from "@internationalized/date";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import type { BranchDto } from "../../branches/branchesApi";
import type { AppointmentDto, DoctorForBranch } from "../types";

interface AppointmentsToolbarProps {
  dateStr: string;
  onDateChange: (dateStr: string) => void;
  isDateUnavailable?: (date: DateValue) => boolean;
  branches: BranchDto[];
  activeBranchId: string | null;
  onBranchChange: (branchId: string | undefined) => void;
  doctors: DoctorForBranch[];
  effectiveDoctorId: string | undefined;
  onDoctorChange: (doctorId: string | undefined) => void;
  searchTerm: string;
  onSearchChange: (v: string) => void;
  visitTypeFilter: string;
  onVisitTypeFilterChange: (v: string) => void;
  paymentFilter: string;
  onPaymentFilterChange: (v: string) => void;
  /** All loaded appointments — used to build the dynamic visit-type list */
  appointments: AppointmentDto[];
}

export function AppointmentsToolbar({
  dateStr, onDateChange, isDateUnavailable,
  branches, activeBranchId, onBranchChange,
  doctors, effectiveDoctorId, onDoctorChange,
  searchTerm, onSearchChange,
  visitTypeFilter, onVisitTypeFilterChange,
  paymentFilter, onPaymentFilterChange,
  appointments,
}: AppointmentsToolbarProps) {
  const { t } = useTranslation();

  const handleDateChange = (d: DateValue | null) => {
    if (!d) return;
    onDateChange(`${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`);
  };

  // Build unique visit-type options from loaded appointments
  const visitTypeOptions = useMemo(() => {
    const seen = new Map<string, string>();
    for (const a of appointments) {
      if (a.visitTypeName && !seen.has(a.visitTypeName)) {
        seen.set(a.visitTypeName, a.visitTypeName);
      }
    }
    return Array.from(seen.entries()).map(([id, label]) => ({ id, label }));
  }, [appointments]);

  const paymentOptions = [
    { id: "unpaid", label: t("appointments.filterUnpaid") },
    { id: "paid",   label: t("appointments.filterPaid")   },
  ];

  return (
    <div className="mb-5 flex flex-col gap-3">
      {/* Row 1 — date, branch, doctor, visit type, payment */}
      <div className="flex flex-wrap items-center gap-3">
        {/* Date picker — non-working days disabled */}
        <AppDatePicker
          value={parseDate(dateStr)}
          onChange={handleDateChange}
          isDateUnavailable={isDateUnavailable}
          ariaLabel={t("common.fields.date")}
          className="w-44 min-w-[11rem]"
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

        {/* Doctor selector — only when multiple doctors */}
        {doctors.length > 1 && (
          <FilterSelect
            value={effectiveDoctorId}
            onChange={(v) => onDoctorChange(v)}
            options={doctors.map((d) => ({ id: d.doctorInfoId, label: d.fullName }))}
            placeholder={t("appointments.selectDoctor")}
            ariaLabel={t("appointments.selectDoctor")}
            className="w-48"
          />
        )}

        {/* Visit type filter */}
        {visitTypeOptions.length > 1 && (
          <FilterSelect
            value={visitTypeFilter || undefined}
            onChange={(v) => onVisitTypeFilterChange(v ?? "")}
            options={visitTypeOptions}
            placeholder={t("appointments.allVisitTypes")}
            ariaLabel={t("appointments.filterByVisitType")}
            className="w-44"
          />
        )}

        {/* Payment status filter */}
        <FilterSelect
          value={paymentFilter || undefined}
          onChange={(v) => onPaymentFilterChange(v ?? "")}
          options={paymentOptions}
          placeholder={t("appointments.allPayments")}
          ariaLabel={t("appointments.filterByPayment")}
          className="w-40"
        />
      </div>

      {/* Row 2 — patient search (full width) */}
      <Input
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={t("appointments.searchPlaceholder")}
        aria-label={t("appointments.searchPlaceholder")}
        fullWidth
      />
    </div>
  );
}
