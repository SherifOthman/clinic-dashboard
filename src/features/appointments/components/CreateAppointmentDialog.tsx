import { Dialog } from "@/core/components/ui/Dialog";
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import type { DateValue } from "@heroui/react";
import { getLocalTimeZone, today } from "@internationalized/date";
import { Button, Checkbox, ListBox, Select } from "@heroui/react";
import { CalendarClock } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useCreateAppointment,
  useUpdateAppointment,
  useDoctorsForBranch,
  useCheckPatientAppointment,
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
  const { t, i18n } = useTranslation();
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
  const [discountError, setDiscountError]       = useState<string | null>(null);
  const [markAsPaid, setMarkAsPaid]             = useState(false);

  const { data: branchDoctors = [] } = useDoctorsForBranch(
    selectedBranchId !== initialBranchId ? selectedBranchId : null,
  );
  const doctors  = selectedBranchId !== initialBranchId ? branchDoctors : initialDoctors;
  const branchId = selectedBranchId;

  const hasOpenedRef = useRef(false);

  useEffect(() => {
    if (isOpen && !hasOpenedRef.current) {
      hasOpenedRef.current = true;
      setSelectedBranchId(initialBranchId);
      setDoctorInfoId(editingAppointment?.doctorInfoId ?? preselectedDoctorInfoId ?? doctors[0]?.doctorInfoId ?? "");
      setPatientId(editingAppointment?.patientId ?? "");
      setPatientName(editingAppointment?.patientName ?? "");
      setVisitTypeId("");
      setDate(today(getLocalTimeZone()));
      setDiscountPercent("");
      setMarkAsPaid(false);
    }
    if (!isOpen) {
      hasOpenedRef.current = false;
    }
  }, [isOpen, preselectedDoctorInfoId, editingAppointment]);

  const selectedDoctor    = doctors.find((d) => d.doctorInfoId === doctorInfoId);

  const { data: visitTypes = [] } = useVisitTypes(selectedDoctor?.memberId ?? null, branchId);
  const { data: workingDays = [] } = useWorkingDays(selectedDoctor?.memberId ?? null, branchId);

  const selectedVisitType = visitTypes.find((vt) => vt.id === visitTypeId);
  const basePrice         = selectedVisitType?.price ?? 0;
  const discountVal       = Math.min(parseFloat(discountPercent) || 0, 100);
  const finalPrice        = basePrice * (1 - discountVal / 100);
  const dayLabel = (dayIndex: number) =>
    new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-GB", {
      weekday: "short",
    }).format(new Date(2024, 0, 7 + dayIndex)); // 2024-01-07 = Sunday

  const todayVal = today(getLocalTimeZone());
  const workingDayNumbers = new Set(workingDays.filter((d) => d.isAvailable).map((d) => d.day));
  const isDateUnavailable = (d: DateValue) => {
    const date = d.toDate(getLocalTimeZone());
    const dateOnly = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const todayOnly = new Date(todayVal.year, todayVal.month - 1, todayVal.day);
    if (dateOnly < todayOnly) return true;
    const dow = date.getDay();
    return workingDays.length > 0 && !workingDayNumbers.has(dow);
  };

  // When working days load, snap the default date to the next available working day
  // so the picker never opens with a disabled date pre-selected
  useEffect(() => {
    if (!isOpen || isEditing || workingDays.length === 0) return;
    if (!isDateUnavailable(todayVal)) return;
    for (let i = 1; i <= 7; i++) {
      const candidate = todayVal.add({ days: i });
      if (!isDateUnavailable(candidate)) {
        setDate(candidate);
        return;
      }
    }
  }, [workingDays, isOpen, isEditing]);

  const dateStr = date
    ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
    : "";

  const dateIsUnavailable = date ? isDateUnavailable(date) : false;

  const { data: patientHasAppointmentToday = false } = useCheckPatientAppointment(
    patientId,
    dateStr,
  );

  const handleSubmit = () => {
    if (!doctorInfoId || !patientId || !visitTypeId || !date) return;
    if (dateIsUnavailable) return;

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
          type: "Queue",
          discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
          markAsPaid,
        },
        { onSuccess: onClose },
      );
    }
  };

  const handleDiscountChange = (value: string) => {
    setDiscountError(null);
    const num = parseFloat(value);
    if (value !== "" && (isNaN(num) || num < 0)) {
      setDiscountPercent("");
      return;
    }
    if (num > 100) {
      setDiscountPercent("100");
      setDiscountError(t("appointments.discountMax"));
      return;
    }
    setDiscountPercent(value);
  };

  const isPending  = createAppointment.isPending || updateAppointment.isPending;
  const canSubmit  = !!doctorInfoId && !!patientId && !!visitTypeId && !!date && !dateIsUnavailable && !patientHasAppointmentToday;
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
          {patientHasAppointmentToday && (
            <p className="text-xs text-danger">{t("appointments.patientAlreadyBooked")}</p>
          )}
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
                  .map((d) => dayLabel(d.day))
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
          <div className="relative">
            <input
              type="number" min={0} max={100} step={1}
              value={discountPercent}
              onChange={(e) => handleDiscountChange(e.target.value)}
              placeholder="0" className={`${inputCls} pr-7`} dir="ltr"
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">
              %
            </span>
          </div>
          {discountError && <p className="text-xs text-danger">{discountError}</p>}
        </div>

        {/* Price preview */}
        {selectedVisitType && (
          <div className="flex flex-col gap-1.5 rounded-lg bg-surface p-3 text-sm">
            <div className="flex items-center justify-between">
              <span className="text-muted">{t("appointments.visitType")}</span>
              <span className="font-medium">${basePrice.toFixed(2)}</span>
            </div>
            {discountVal > 0 && (
              <div className="flex items-center justify-between text-success">
                <span>{t("appointments.discount")} ({discountVal}%)</span>
                <span>-${(basePrice * discountVal / 100).toFixed(2)}</span>
              </div>
            )}
            <div className="flex items-center justify-between border-t border-border pt-1.5 font-semibold">
              <span>{t("appointments.total")}</span>
              <span>${finalPrice.toFixed(2)}</span>
            </div>
          </div>
        )}

        {/* Mark as paid */}
        {!isEditing && (
          <Checkbox
            isSelected={markAsPaid}
            onChange={setMarkAsPaid}
            variant="secondary"
          >
            <Checkbox.Control>
              <Checkbox.Indicator />
            </Checkbox.Control>
            <Checkbox.Content>
              <span className="text-sm">{t("appointments.markAsPaid")}</span>
            </Checkbox.Content>
          </Checkbox>
        )}

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
