import { Dialog } from "@/core/components/ui/Dialog";
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import type { DateValue, TimeValue } from "@heroui/react";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import {
  Button,
  FieldError,
  Label,
  ListBox,
  Select,
  TimeField,
} from "@heroui/react";
import { CalendarClock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  useAppointments,
  useCreateAppointment,
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
  const { data: branches = [] } = useBranches();

  const [selectedBranchId, setSelectedBranchId] = useState(initialBranchId);
  const [doctorInfoId, setDoctorInfoId] = useState(preselectedDoctorInfoId ?? "");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [visitTypeId, setVisitTypeId] = useState("");
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));
  const [timeValue, setTimeValue] = useState<TimeValue | null>(null);
  const [discountPercent, setDiscountPercent] = useState("");
  const [durationOverride, setDurationOverride] = useState("");

  // When branch changes, reload doctors for that branch
  const { data: branchDoctors = [] } = useDoctorsForBranch(
    selectedBranchId !== initialBranchId ? selectedBranchId : null,
  );

  // Use branch-specific doctors if branch changed, otherwise use the passed-in doctors
  const doctors = selectedBranchId !== initialBranchId ? branchDoctors : initialDoctors;
  const branchId = selectedBranchId;

  useEffect(() => {
    if (isOpen) {
      setSelectedBranchId(initialBranchId);
      setDoctorInfoId(editingAppointment?.doctorInfoId ?? preselectedDoctorInfoId ?? doctors[0]?.doctorInfoId ?? "");
      setPatientId(editingAppointment?.patientId ?? "");
      setPatientName(editingAppointment?.patientName ?? "");
      setVisitTypeId("");
      setDate(today(getLocalTimeZone()));
      setTimeValue(editingAppointment?.scheduledTime
        ? parseTime(editingAppointment.scheduledTime + ":00")
        : null);
      setDiscountPercent("");
      setDurationOverride(editingAppointment?.visitDurationMinutes ? String(editingAppointment.visitDurationMinutes) : "");
    }
  }, [isOpen, preselectedDoctorInfoId, initialDoctors, editingAppointment]);

  const selectedDoctor = doctors.find((d) => d.doctorInfoId === doctorInfoId);
  const isQueue = selectedDoctor?.appointmentType === "Queue";

  // Working days for date blocking
  const { data: workingDays = [] } = useWorkingDays(
    selectedDoctor?.memberId ?? null,
    branchId,
  );

  const workingDayNumbers = new Set(
    workingDays.filter((d) => d.isAvailable).map((d) => d.day),
  );

  const isDateUnavailable = (d: DateValue): boolean => {
    const dow = d.toDate(getLocalTimeZone()).getDay();
    return workingDays.length > 0 && !workingDayNumbers.has(dow);
  };

  // Working hours for the selected day
  const selectedDow = date ? date.toDate(getLocalTimeZone()).getDay() : -1;
  const workingHours = workingDays.find((d) => d.day === selectedDow && d.isAvailable);

  // Existing appointments for this doctor+date — to block booked slots
  const dateStr = date
    ? `${date.year}-${String(date.month).padStart(2, "0")}-${String(date.day).padStart(2, "0")}`
    : "";

  const { data: existingAppointments = [] } = useAppointments(
    dateStr,
    !isQueue && !!doctorInfoId ? branchId : null,
    doctorInfoId ? [doctorInfoId] : [],
  );

  // Set of booked times "HH:mm"
  const bookedTimes = new Set(
    existingAppointments
      .filter((a) => a.status !== "Cancelled" && a.status !== "NoShow")
      .map((a) => a.scheduledTime)
      .filter(Boolean) as string[],
  );

  // Validate selected time isn't booked
  const selectedTimeStr = timeValue
    ? `${String(timeValue.hour).padStart(2, "0")}:${String(timeValue.minute).padStart(2, "0")}`
    : null;
  const isTimeBooked = !!selectedTimeStr && bookedTimes.has(selectedTimeStr);

  // Visit types
  const { data: visitTypes = [] } = useVisitTypes(
    selectedDoctor?.memberId ?? null,
    branchId,
  );

  const handleSubmit = () => {
    if (!doctorInfoId || !patientId || !visitTypeId || !date) return;

    createAppointment.mutate(
      {
        branchId,
        patientId,
        doctorInfoId,
        visitTypeId,
        date: dateStr,
        type: isQueue ? "Queue" : "Time",
        scheduledTime: !isQueue && selectedTimeStr ? selectedTimeStr : undefined,
        discountPercent: discountPercent ? parseFloat(discountPercent) : undefined,
        visitDurationMinutes: durationOverride ? parseInt(durationOverride) : undefined,
      },
      { onSuccess: onClose },
    );
  };

  const canSubmit =
    !!doctorInfoId &&
    !!patientId &&
    !!visitTypeId &&
    !!date &&
    (isQueue || (!!timeValue && !isTimeBooked));

  const inputCls =
    "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      ariaLabel={t("appointments.newAppointment")}
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10">
            <CalendarClock className="h-5 w-5 text-accent" />
          </div>
          <h2 className="text-lg font-bold">{t("appointments.newAppointment")}</h2>
        </div>
      }
    >
      <div className="flex flex-col gap-4">
        {/* Branch — only shown when there are multiple branches */}
        {branches.length > 1 && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("appointments.selectBranch")}</label>
            <Select
              value={selectedBranchId}
              onChange={(v) => {
                setSelectedBranchId(String(v));
                setDoctorInfoId("");
                setVisitTypeId("");
                setTimeValue(null);
              }}
              aria-label={t("appointments.selectBranch")}
            >
              <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
              <Select.Popover>
                <ListBox>
                  {branches.map((b) => (
                    <ListBox.Item key={b.id} id={b.id} textValue={b.name}>
                      {b.name}
                      <ListBox.ItemIndicator />
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
            onChange={(v) => { setDoctorInfoId(String(v)); setVisitTypeId(""); setTimeValue(null); }}
            aria-label={t("appointments.doctor")}
          >
            <Select.Trigger><Select.Value /><Select.Indicator /></Select.Trigger>
            <Select.Popover>
              <ListBox>
                {doctors.map((d) => (
                  <ListBox.Item key={d.doctorInfoId} id={d.doctorInfoId} textValue={d.fullName}>
                    {d.fullName}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Patient — search with inline quick-create */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t("appointments.patient")}</label>
          <PatientSearchField
            value={patientId}
            patientName={patientName}
            onChange={(id, name) => { setPatientId(id); setPatientName(name); }}
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
                    {vt.name} — ${vt.price}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Date */}
        <div className="flex flex-col gap-1">
          <AppDatePicker
            label={t("appointments.date")}
            value={date}
            onChange={(v) => { setDate(v); setTimeValue(null); }}
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

        {/* Time — HeroUI TimeField, only for time-based doctors */}
        {!isQueue && (
          <div className="flex flex-col gap-1">
            <TimeField
              value={timeValue}
              onChange={setTimeValue}
              hourCycle={24}
              granularity="minute"
              isInvalid={isTimeBooked}
              minValue={workingHours ? parseTime(workingHours.startTime) : undefined}
              maxValue={workingHours ? parseTime(workingHours.endTime) : undefined}
              name="scheduledTime"
              isRequired={!isQueue}
            >
              <Label className="text-sm font-medium">{t("appointments.time")}</Label>
              <TimeField.Group fullWidth>
                <TimeField.Prefix>
                  <Clock className="h-4 w-4 text-muted" />
                </TimeField.Prefix>
                <TimeField.Input>
                  {(segment) => <TimeField.Segment segment={segment} />}
                </TimeField.Input>
              </TimeField.Group>
              {isTimeBooked && (
                <FieldError>{t("appointments.slotBooked")}</FieldError>
              )}
              {!isTimeBooked && bookedTimes.size > 0 && (
                <p className="mt-1 text-xs text-muted">
                  {t("appointments.bookedSlots")}: {[...bookedTimes].sort().join(", ")}
                </p>
              )}
            </TimeField>
          </div>
        )}

        {/* Duration override — only for time-based */}
        {!isQueue && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">
              {t("appointments.visitDuration")}
              <span className="ms-1 text-xs text-muted">
                ({t("appointments.defaultDuration", { min: selectedDoctor?.defaultVisitDurationMinutes ?? 30 })})
              </span>
            </label>
            <input
              type="number" min={5} max={120} step={5}
              value={durationOverride}
              onChange={(e) => setDurationOverride(e.target.value)}
              placeholder={String(selectedDoctor?.defaultVisitDurationMinutes ?? 30)}
              className={inputCls} dir="ltr"
            />
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
          <Button
            variant="primary" onPress={handleSubmit}
            isDisabled={!canSubmit} isPending={createAppointment.isPending}
          >
            {t("appointments.book")}
          </Button>
        </div>
      </div>
    </Dialog>
  );
}
