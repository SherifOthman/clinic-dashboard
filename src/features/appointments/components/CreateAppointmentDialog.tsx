import { Dialog } from "@/core/components/ui/Dialog";
import { AppDatePicker } from "@/core/components/ui/AppDatePicker";
import { getLocalTimeZone, parseDate, today, type DateValue } from "@internationalized/date";
import { Button, Checkbox, ListBox, Select } from "@heroui/react";
import { CalendarClock } from "lucide-react";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import {
  useCreateAppointment,
  useUpdateAppointment,
  useDoctorsForBranch,
  useCheckPatientAppointment,
} from "../appointmentsHooks";
import type { AppointmentDto, DoctorForBranch } from "../types";
import { appointmentSchema, type AppointmentFormData } from "../schemas";
import { PatientSearchField } from "./PatientSearchField";
import { useBranches } from "@/features/branches/branchesHooks";
import { useVisitTypes, useWorkingDays } from "@/features/staff/staffQueries";

interface CreateAppointmentDialogProps {
  isOpen: boolean;
  onClose: () => void;
  branchId: string;
  doctors: DoctorForBranch[];
  preselectedDoctorInfoId?: string;
  editingAppointment?: AppointmentDto | null;
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
  const isEditing = !!editingAppointment;

  const createAppointment = useCreateAppointment();
  const updateAppointment = useUpdateAppointment();
  const { data: branches = [] } = useBranches();

  const { control, watch, setValue, handleSubmit, reset, register } = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema) as any,
    defaultValues: {
      branchId:     initialBranchId,
      doctorInfoId: preselectedDoctorInfoId ?? "",
      patientId:    "",
      patientName:  "",
      visitTypeId:  "",
      date:         todayStr(),
      markAsPaid:   false,
    },
  });

  // Reset when dialog opens
  useEffect(() => {
    if (isOpen) {
      reset({
        branchId:        initialBranchId,
        doctorInfoId:    editingAppointment?.doctorInfoId ?? preselectedDoctorInfoId ?? initialDoctors[0]?.doctorInfoId ?? "",
        patientId:       editingAppointment?.patientId ?? "",
        patientName:     editingAppointment?.patientName ?? "",
        visitTypeId:     "",
        date:            todayStr(),
        discountPercent: undefined,
        markAsPaid:      false,
      });
    }
  }, [isOpen]);

  const branchId     = watch("branchId");
  const doctorInfoId = watch("doctorInfoId");
  const patientId    = watch("patientId");
  const patientName  = watch("patientName");
  const date         = watch("date");
  const discount     = watch("discountPercent");

  const { data: branchDoctors = [] } = useDoctorsForBranch(
    branchId !== initialBranchId ? branchId : null,
  );
  const doctors = branchId !== initialBranchId ? branchDoctors : initialDoctors;

  const selectedDoctor = doctors.find((d) => d.doctorInfoId === doctorInfoId);
  const { data: visitTypes = [] } = useVisitTypes(selectedDoctor?.memberId ?? null, branchId);
  const { data: workingDays = [] } = useWorkingDays(selectedDoctor?.memberId ?? null, branchId);

  const { data: patientAlreadyBooked = false } = useCheckPatientAppointment(
    isEditing ? "" : patientId,
    isEditing ? "" : date,
  );

  const workingDayNumbers = new Set(workingDays.filter((d) => d.isAvailable).map((d) => d.day));
  const isDateUnavailable = (d: DateValue) =>
    workingDays.length > 0 && !workingDayNumbers.has(d.toDate(getLocalTimeZone()).getDay());

  // Snap to next working day when today is unavailable
  useEffect(() => {
    if (!isOpen || isEditing || workingDays.length === 0) return;
    const todayVal = today(getLocalTimeZone());
    if (isDateUnavailable(todayVal)) {
      for (let i = 1; i <= 7; i++) {
        const candidate = todayVal.add({ days: i });
        if (!isDateUnavailable(candidate)) {
          setValue("date", toDateStr(candidate));
          return;
        }
      }
    }
  }, [workingDays, isOpen, isEditing]);

  const selectedVisitType = visitTypes.find((vt) => vt.id === watch("visitTypeId"));
  const basePrice   = selectedVisitType?.price ?? 0;
  const discountVal = Math.min(Number(discount) || 0, 100);
  const finalPrice  = basePrice * (1 - discountVal / 100);

  const dayLabel = (dow: number) =>
    new Intl.DateTimeFormat(i18n.language === "ar" ? "ar-EG" : "en-GB", { weekday: "short" })
      .format(new Date(2024, 0, 7 + dow));

  const onSubmit = (data: AppointmentFormData) => {
    if (isEditing && editingAppointment) {
      updateAppointment.mutate(
        { id: editingAppointment.id, visitTypeId: data.visitTypeId, discountPercent: data.discountPercent },
        { onSuccess: onClose },
      );
    } else {
      createAppointment.mutate(
        {
          branchId:        data.branchId,
          patientId:       data.patientId,
          doctorInfoId:    data.doctorInfoId,
          visitTypeId:     data.visitTypeId,
          date:            data.date,
          type:            "Queue",
          discountPercent: data.discountPercent,
          markAsPaid:      data.markAsPaid,
        },
        { onSuccess: onClose },
      );
    }
  };

  const isPending = createAppointment.isPending || updateAppointment.isPending;
  const inputCls  = "w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none focus:border-accent";

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
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4">

        {/* Branch — only when multiple branches and not editing */}
        {branches.length > 1 && !isEditing && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("appointments.selectBranch")}</label>
            {/* Controller needed: HeroUI Select can't use register, and we need to reset doctorInfoId on change */}
            <Controller control={control} name="branchId" render={({ field }) => (
              <Select
                value={field.value}
                onChange={(v) => { field.onChange(String(v)); setValue("doctorInfoId", ""); setValue("visitTypeId", ""); }}
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
            )} />
          </div>
        )}

        {/* Doctor */}
        {!isEditing && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("appointments.doctor")}</label>
            {/* Controller needed: HeroUI Select */}
            <Controller control={control} name="doctorInfoId" render={({ field }) => (
              <Select
                value={field.value}
                onChange={(v) => { field.onChange(String(v)); setValue("visitTypeId", ""); }}
                aria-label={t("appointments.doctor")}
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
            )} />
          </div>
        )}

        {/* Patient — Controller needed: value set programmatically via setValue from parent */}
        {!isEditing && (
          <div className="flex flex-col gap-1">
            <label className="text-sm font-medium">{t("appointments.patient")}</label>
            <Controller control={control} name="patientId" render={({ field }) => (
              <PatientSearchField
                value={field.value}
                patientName={patientName}
                onChange={(id, name) => {
                  field.onChange(id);
                  setValue("patientName", name, { shouldDirty: true });
                }}
              />
            )} />
            {patientAlreadyBooked && (
              <p className="text-xs text-danger">{t("appointments.patientAlreadyBooked")}</p>
            )}
          </div>
        )}

        {/* Visit type — Controller needed: HeroUI Select */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">{t("appointments.visitType")}</label>
          <Controller control={control} name="visitTypeId" render={({ field }) => (
            <Select
              value={field.value}
              onChange={(v) => field.onChange(String(v))}
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
          )} />
        </div>

        {/* Date — Controller needed: value set programmatically via setValue */}
        {!isEditing && (
          <div className="flex flex-col gap-1">
            <Controller control={control} name="date" render={({ field }) => (
              <AppDatePicker
                label={t("appointments.date")}
                value={field.value ? parseDate(field.value) : null}
                onChange={(v) => field.onChange(v ? toDateStr(v) : "")}
                minValue={today(getLocalTimeZone())}
                isDateUnavailable={isDateUnavailable}
                className="w-full"
              />
            )} />
            {workingDays.length > 0 && (
              <p className="mt-1 text-xs text-muted">
                {t("appointments.doctorWorksOn")}{" "}
                {workingDays.filter((d) => d.isAvailable).map((d) => dayLabel(d.day)).join(", ")}
              </p>
            )}
          </div>
        )}

        {/* Discount — plain input, register works fine */}
        <div className="flex flex-col gap-1">
          <label className="text-sm font-medium">
            {t("appointments.discount")} <span className="text-muted text-xs">({t("common.optional")})</span>
          </label>
          <div className="relative">
            <input
              type="number" min={0} max={100} step={1}
              placeholder="0"
              className={`${inputCls} pr-7`}
              dir="ltr"
              {...register("discountPercent", { valueAsNumber: true })}
            />
            <span className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-sm text-muted">%</span>
          </div>
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

        {/* Mark as paid — Controller needed: HeroUI Checkbox */}
        {!isEditing && (
          <Controller control={control} name="markAsPaid" render={({ field }) => (
            <Checkbox isSelected={field.value} onChange={field.onChange} variant="secondary">
              <Checkbox.Control><Checkbox.Indicator /></Checkbox.Control>
              <Checkbox.Content><span className="text-sm">{t("appointments.markAsPaid")}</span></Checkbox.Content>
            </Checkbox>
          )} />
        )}

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onPress={onClose}>{t("common.cancel")}</Button>
          <Button type="submit" variant="primary" isDisabled={patientAlreadyBooked} isPending={isPending}>
            {isEditing ? t("common.save") : t("appointments.book")}
          </Button>
        </div>
      </form>
    </Dialog>
  );
}

function todayStr(): string {
  return toDateStr(today(getLocalTimeZone()));
}

function toDateStr(d: { year: number; month: number; day: number }): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}
