import { Dialog } from "@/core/components/ui/Dialog";
import type { WorkingDayDto } from "@/features/staff/staffApi";
import { staffApi } from "@/features/staff/staffApi";
import type { DateValue, TimeValue } from "@heroui/react";
import { getLocalTimeZone, parseTime, today } from "@internationalized/date";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  FieldError,
  Label,
  ListBox,
  Select,
  TimeField,
} from "@heroui/react";
import { CalendarClock, Clock } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { useCreateAppointment } from "../appointmentsHooks";
import type { DoctorForBranch } from "../types";
import { PatientSearchField } from "./PatientSearchField";

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  doctors: DoctorForBranch[];
  preselectedDoctorInfoId?: string;
}

export function CreateAppointmentDialog({
  isOpen,
  onClose,
  branchId,
  doctors,
  preselectedDoctorInfoId,
}: CreateAppointmentDialogProps) {
  const { t, i18n } = useTranslation();
  const isAr = i18n.language === "ar";
  const createAppointment = useCreateAppointment();

  const [doctorInfoId, setDoctorInfoId] = useState(preselectedDoctorInfoId ?? "");
  const [patientId, setPatientId] = useState("");
  const [patientName, setPatientName] = useState("");
  const [visitTypeId, setVisitTypeId] = useState("");
  const [date, setDate] = useState<DateValue | null>(today(getLocalTimeZone()));
  const [timeValue, setTimeValue] = useState<TimeValue | null>(null);
  const [discountPercent, setDiscountPercent] = useState("");
  const [durationOverride, setDurationOverride] = useState("");

  useEffect(() => {
    if (isOpen) {
      setDoctorInfoId(preselectedDoctorInfoId ?? doctors[0]?.doctorInfoId ?? "");
      setPatientId("");
      setPatientName("");
      setVisitTypeId("");
      setDate(today(getLocalTimeZone()));
      setTimeValue(null);
      setDiscountPercent("");
      setDurationOverride("");
    }
  }, [isOpen, preselectedDoctorInfoId, doctors]);

  const selectedDoctor = doctors.find((d) => d.doctorInfoId === doctorInfoId);
  const isQueue = selectedDoctor?.appointmentType === "Queue";

  // Working days for date blocking
  const { data: workingDays = [] } = useQuery<WorkingDayDto[]>({
    queryKey: ["working-days", doctorInfoId, branchId],
    queryFn: () => staffApi.getWorkingDays(selectedDoctor?.memberId ?? "", branchId),
    enabled: !!doctorInfoId && !!branchId && !!selectedDoctor?.memberId,
    staleTime: 5 * 60_000,
  });

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

  const { data: existingAppointments = [] } = useQuery({
    queryKey: ["appointments", dateStr, branchId, [doctorInfoId]],
    queryFn: () =>
      import("../appointmentsApi").then((m) =>
        m.appointmentsApi.getAppointments(dateStr, branchId, [doctorInfoId]),
      ),
    enabled: !isQueue && !!doctorInfoId && !!dateStr,
    staleTime: 30_000,
  });

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
  const { data: visitTypes = [] } = useQuery({
    queryKey: ["visit-types", doctorInfoId, branchId],
    queryFn: () => staffApi.getVisitTypes(selectedDoctor?.memberId ?? "", branchId),
    enabled: !!doctorInfoId && !!branchId && !!selectedDoctor?.memberId,
    staleTime: 5 * 60_000,
  });

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
                  <ListBox.Item key={vt.id} id={vt.id} textValue={isAr ? vt.nameAr : vt.nameEn}>
                    {isAr ? vt.nameAr : vt.nameEn} — ${vt.price}
                    <ListBox.ItemIndicator />
                  </ListBox.Item>
                ))}
              </ListBox>
            </Select.Popover>
          </Select>
        </div>

        {/* Date — HeroUI DatePicker with unavailable days */}
        <DatePicker
          value={date}
          onChange={(v) => { setDate(v); setTimeValue(null); }}
          minValue={today(getLocalTimeZone())}
          isDateUnavailable={isDateUnavailable}
          name="appointmentDate"
        >
          <Label className="text-sm font-medium">{t("appointments.date")}</Label>
          <DateField.Group fullWidth>
            <DateField.Input>
              {(segment) => <DateField.Segment segment={segment} />}
            </DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
          {workingDays.length > 0 && (
            <p className="mt-1 text-xs text-muted">
              {t("appointments.doctorWorksOn")}{" "}
              {workingDays
                .filter((d) => d.isAvailable)
                .map((d) => ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][d.day])
                .join(", ")}
            </p>
          )}
          <FieldError />
          <DatePicker.Popover>
            <Calendar aria-label={t("appointments.date")}>
              <Calendar.Header>
                <Calendar.YearPickerTrigger>
                  <Calendar.YearPickerTriggerHeading />
                  <Calendar.YearPickerTriggerIndicator />
                </Calendar.YearPickerTrigger>
                <Calendar.NavButton slot="previous" />
                <Calendar.NavButton slot="next" />
              </Calendar.Header>
              <Calendar.Grid>
                <Calendar.GridHeader>
                  {(day) => <Calendar.HeaderCell>{day}</Calendar.HeaderCell>}
                </Calendar.GridHeader>
                <Calendar.GridBody>
                  {(d) => <Calendar.Cell date={d} />}
                </Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>

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
