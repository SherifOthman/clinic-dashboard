import { Dialog } from "@/core/components/ui/Dialog";
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import type { DateValue } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, ListBox, Select } from "@heroui/react";
import { CalendarClock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateAppointment,
  useUpdateAppointment,
  useDoctorsForBranch,
} from "../appointmentsHooks";
import type { DoctorForBranch } from "../types";
import { PatientSearchField } from "./PatientSearchField";
import { useBranches } from "@/features/branches/branchesHooks";
import { useVisitTypes, useWorkingDays } from "@/features/staff/staffQueries";

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  doctors: DoctorForBranch[];
  preselectedDoctorInfoId?: string;
  editingAppointment?: import("../types").AppointmentDto | null;
}

export function CreateAppointmentDialog({
  isOpen,
  onClose,
  branchId: initialBranchId,
  doctors: initialDoctors,
  preselectedDoctorInfoId,
  editingAppointment,
}: CreateAppointmentDialogProps) {
  const { t } = useTranslation();
  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const isEditing = !!editingAppointment;
  const { data: branches = [] } = useBranches();

  const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId);
  const [doctorInfoId, setDoctorInfoId]         = useState(preselectedDoctorInfoId ?? "");
  const [patientId, setPatientId]               = useState("");
  const [patientName, setPatientName]           = useState("");
  const [visitTypeId, setVisitTypeId]           = useState("");
  const [date, setDate]                         = useState<DateValue | null>(today(getLocalTimeZone()));
  const [discountPercent, setDiscountPercent]   = useState("");

  const { data: branchDoctors = [] } = useDoctorsForBranch(
    selectedBranchId !== initialBranchId ? selectedBranchId : null,
  );
  const doctors  = selectedBranchId !== initialBranchId ? branchDoctors : initialDoctors;
  const branchId = selectedBranchId;

  useEffect(() => {
    if (isOpen) {
      setSelectedBranchId(initialBranchId);
      setDoctorInfoId(editingAppointment?.doctorInfoId ?? preselectedDoctorInfoId ?? doctors[0]?.doctorInfoId ?? "");
      setPatientId(editingAppointment?.patientId ?? "");
      setPatientName(editingAppointment?.patientName ?? "");
      setVisitTypeId("");
      setDate(today(getLocalTimeZone()));
      setDiscountPercent("");
    }
  }, [isOpen, preselectedDoctorInfoId, initialDoctors, editingAppointment]);

  const selectedDoctor = doctors.find((d) => d.doctorInfoId === doctorInfoId);

  // Working days for date blocking
  const { data: workingDays = [] } = useWorkingDays(selectedDoctor?.memberId ?? null, branchId);
  const workingDayNumbers = new Set(workingDays.filter((d) => d.isAvailable).map((d) => d.day));
  const isDateUnavailable = (d: DateValue) => {
    const dow = d.toDate(getLocalTimeZone()).getDay();
    return workingDays.length > 0 && !workingDayNumbers.has(dow);
  };

  const dateStr = date
    ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
    : "";

  const { data: visitTypes = [] } = useVisitTypes(selectedDoctor?.memberId ?? null, branchId);

  const handleSubmit = () => {
    if (!doctorInfoId || !patientId || !visitTypeId || !date) return;

    if (isEditing && editingAppointment) {
      updateAppointment.mutate(
        {
          id: editingAppointment.id,
          visitTypeId,
          discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
        },
        { onSuccess: onClose },
      );
    } else {
      createAppointment.mutate(
        {
          branchId,
          patientId,
          doctorInfoId,
          visitTypeId,
          date: dateStr,
          type: "Queue",   // Queue-only for now; Time support kept in backend for future
          discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending  = createAppointment.isPending || updateAppointment.isPending;
  const canSubmit  = !!doctorInfoId && !!patientId && !!visitTypeId && !!date;
  const inputCls   = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={isEditing ? t("appointments.editAppointment") : t("appointments.newAppointment")}
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <CalendarClock className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-lg font-bold">
            {isEditing ? t("appointments.editAppointment") : t("appointments.newAppointment")}
          </h2>
        </div>
      }
    >
      <div className="flex flex-col gap-4">

        {/* Branch — only when multiple branches and not editing */}
        {branches.length > 1 && !isEditing && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("appointments.selectBranch")}</label>
            <Select
              value={selectedBranchId}
              onChange={(v) => { setSelectedBranchId(String(v)); setDoctorInfoId(""); setVisitTypeId(""); }}
              aria-label={t("appointments.selectBranch")}
            >
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {branches.map((b) => (
                    <ListBox.Item key={b.id} id={b.id} textValue={b.name}>
                      {b.name}<ListBox.ItemIndicator />
                    </ListBox.Item>
                  ))}
                </ListBox>
              </Select.Popover>
            </Select>
          </div>
        )}

        {/* Doctor */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t("appointments.doctor")}</label>
          <Select
            value={doctorInfoId}
            onChange={(v) => { setDoctorInfoId(String(v)); setVisitTypeId(""); }}
            aria-label={t("appointments.doctor")}
            isDisabled={isEditing}
          >
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover>
              <ListBox>
                {doctors.map((d) => (
                  <ListBox.Item key={d.doctorInfoId} id={d.doctorInfoId} textValue={d.fullName}>
                    {d.fullName}<ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Patient */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t("appointments.patient")}</label>
          <PatientSearchField
            value={patientId}
            patientName={patientName}
            onChange={(id, name) => { setPatientId(id); setPatientName(name); }}
            isDisabled={isEditing}
          />
        </div>

        {/* Visit type */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t("appointments.visitType")}</label>
          <Select
            value={visitTypeId}
            onChange={(v) => setVisitTypeId(String(v))}
            aria-label={t("appointments.visitType")}
            isDisabled={!doctorInfoId || visitTypes.length === 0}
          >
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover>
              <ListBox>
                {visitTypes.filter((vt) => vt.isActive).map((vt) => (
                  <ListBox.Item key={vt.id} id={vt.id} textValue={vt.name}>
                    {vt.name} — ${vt.price}<ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Date — hidden when editing (date can't change) */}
        {!isEditing && (
          <div className="flex flex-col gap-1">
            <AppDatePicker
              label={t("appointments.date")}
              value={date}
              onChange={(v) => setDate(v)}
              minValue={today(getLocalTimeZone())}
              isDateUnavailable={isDateUnavailable}
              className="w-full"
            />
            {workingDays.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                {t("appointments.doctorWorksOn")}{" "}
                {workingDays
                  .filter((d) => d.isAvailable)
                  .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day])
                  .join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Discount */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {t("appointments.discount")} <span className="text-muted text-xs">({t("common.optional")})</span>
          </label>
          <input
            type="number" min={0} max={100} step={1}
            value={discountPercent}
            onChange={(e) => setDiscountPercent(e.target.value)}
            placeholder="0" className={inputCls} dir="ltr"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onPress={onClose}>{t("common.cancel")}</Button>
          <Button variant="primary" onPress={handleSubmit} isDisabled={!canSubmit} isPending={isPending}>
            {isEditing ? t("common.save") : t("appointments.book")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
