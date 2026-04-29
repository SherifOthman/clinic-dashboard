import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone, today } from "@internationalized/date";
import {
  Button,
  Calendar,
  DateField,
  DatePicker,
  Label,
} from "@heroui/react";
import { LayoutGrid, LayoutList, Maximize2 } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBranches } from "../branches/branchesHooks";
import { useAppointments, useDoctorsForBranch } from "./appointmentsHooks";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { DoctorAppointmentsPanel } from "./components/DoctorAppointmentsPanel";
import { type ViewMode, resolveViewMode, MULTI_THRESHOLD } from "./viewMode";

function toDateString(d: DateValue): string {
  return `${d.year}-${String(d.month).padStart(2, "0")}-${String(d.day).padStart(2, "0")}`;
}

export default function AppointmentsPage() {
  const { t } = useTranslation();

  const [dateValue, setDateValue] = useState<DateValue | null>(today(getLocalTimeZone()));
  const [branchId, setBranchId] = useState<string | undefined>();
  const [selectedDoctorId, setSelectedDoctorId] = useState<string | undefined>();
  const [manualViewMode, setManualViewMode] = useState<ViewMode | null>(null);
  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>();
  const createDialog = useDialogState();

  const { data: branches = [] } = useBranches();
  const activeBranchId = branchId ?? branches[0]?.id ?? null;

  const { data: doctors = [], isLoading: doctorsLoading } = useDoctorsForBranch(activeBranchId);

  // ── ViewMode resolution ────────────────────────────────────────────────────
  const viewMode = resolveViewMode(doctors.length, manualViewMode);
  const isCompact = viewMode === "compact";
  const isSingle  = viewMode === "single";

  // In compact mode, show only the selected doctor
  const effectiveDoctorId = selectedDoctorId ?? doctors[0]?.doctorInfoId;
  const visibleDoctors = isCompact
    ? doctors.filter((d) => d.doctorInfoId === effectiveDoctorId)
    : viewMode === "single" && doctors.length > 1
      ? doctors.filter((d) => d.doctorInfoId === effectiveDoctorId)
      : doctors;

  const doctorInfoIds = visibleDoctors.map((d) => d.doctorInfoId);
  const dateStr = dateValue ? toDateString(dateValue) : "";

  const { data: appointments = [], isLoading: apptLoading } = useAppointments(
    dateStr,
    activeBranchId,
    doctorInfoIds.length > 0 ? doctorInfoIds : undefined,
  );

  const isLoading = doctorsLoading || apptLoading;

  const openCreate = (doctorInfoId?: string) => {
    setPreselectedDoctor(doctorInfoId);
    createDialog.openCreate();
  };

  return (
    <div>
      <PageHeader
        title={t("navigation.appointments")}
        subtitle={t("appointments.subtitle")}
        action={
          <Button variant="primary" size="sm" onPress={() => openCreate()}>
            + {t("appointments.newAppointment")}
          </Button>
        }
      />

      {/* ── Toolbar ─────────────────────────────────────────────────────────── */}
      <div className="mb-5 flex flex-wrap items-center gap-3">
        {/* HeroUI DatePicker */}
        <DatePicker value={dateValue} onChange={setDateValue} name="viewDate" className="w-48">
          <Label className="sr-only">{t("appointments.date")}</Label>
          <DateField.Group fullWidth>
            <DateField.Input>{(seg) => <DateField.Segment segment={seg} />}</DateField.Input>
            <DateField.Suffix>
              <DatePicker.Trigger><DatePicker.TriggerIndicator /></DatePicker.Trigger>
            </DateField.Suffix>
          </DateField.Group>
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
                <Calendar.GridBody>{(d) => <Calendar.Cell date={d} />}</Calendar.GridBody>
              </Calendar.Grid>
              <Calendar.YearPickerGrid>
                <Calendar.YearPickerGridBody>
                  {({ year }) => <Calendar.YearPickerCell year={year} />}
                </Calendar.YearPickerGridBody>
              </Calendar.YearPickerGrid>
            </Calendar>
          </DatePicker.Popover>
        </DatePicker>

        {/* Branch selector */}
        {branches.length > 1 && (
          <FilterSelect
            value={activeBranchId ?? undefined}
            onChange={(v) => { setBranchId(v); setSelectedDoctorId(undefined); }}
            options={branches.map((b) => ({ id: b.id, label: b.name }))}
            placeholder={t("appointments.selectBranch")}
            ariaLabel={t("appointments.selectBranch")}
            className="w-44"
          />
        )}

        {/* Doctor selector — shown in single/compact mode */}
        {(isSingle || isCompact) && doctors.length > 1 && (
          <FilterSelect
            value={effectiveDoctorId}
            onChange={(v) => setSelectedDoctorId(v)}
            options={doctors.map((d) => ({ id: d.doctorInfoId, label: d.fullName }))}
            placeholder={t("appointments.selectDoctor")}
            ariaLabel={t("appointments.selectDoctor")}
            className="w-48"
          />
        )}

        {/* Auto-mode hint */}
        {!manualViewMode && doctors.length > 0 && (
          <span className="hidden text-xs text-muted sm:block">
            {viewMode === "multi"   && t("appointments.autoMultiView")}
            {viewMode === "single"  && t("appointments.autoSingleView")}
            {viewMode === "compact" && t("appointments.manyDoctorsHint", { count: doctors.length })}
          </span>
        )}

        {/* Layout toggle */}
        <div className="ms-auto flex gap-1">
          <Button size="sm" variant={viewMode === "multi" ? "primary" : "outline"} isIconOnly
            onPress={() => setManualViewMode("multi")} aria-label={t("appointments.multiDoctorView")}>
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button size="sm" variant={viewMode === "single" ? "primary" : "outline"} isIconOnly
            onPress={() => setManualViewMode("single")} aria-label={t("appointments.singleDoctorView")}>
            <LayoutList className="h-4 w-4" />
          </Button>
          <Button size="sm" variant={viewMode === "compact" ? "primary" : "outline"} isIconOnly
            onPress={() => setManualViewMode("compact")} aria-label="Compact">
            <Maximize2 className="h-4 w-4" />
          </Button>
          {manualViewMode && (
            <Button size="sm" variant="ghost" onPress={() => setManualViewMode(null)}
              className="text-xs text-muted">
              Auto
            </Button>
          )}
        </div>
      </div>

      {/* ── Doctor panels ────────────────────────────────────────────────────── */}
      {visibleDoctors.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center text-muted">
          {t("appointments.noDoctors")}
        </div>
      ) : (
        <div className={
          viewMode === "multi" && visibleDoctors.length > 1
            ? "grid grid-cols-1 gap-5 lg:grid-cols-2"
            : "flex flex-col gap-5"
        }>
          {visibleDoctors.map((doctor) => (
            <DoctorAppointmentsPanel
              key={doctor.doctorInfoId}
              doctor={doctor}
              appointments={appointments.filter((a) => a.doctorInfoId === doctor.doctorInfoId)}
              isLoading={isLoading}
              viewMode={viewMode}
              onAddAppointment={() => openCreate(doctor.doctorInfoId)}
              branchId={activeBranchId ?? undefined}
            />
          ))}
        </div>
      )}

      {/* ── Create dialog ─────────────────────────────────────────────────────── */}
      {activeBranchId && createDialog.state.mode !== "closed" && (
        <CreateAppointmentDialog
          isOpen
          onClose={createDialog.close}
          branchId={activeBranchId}
          doctors={doctors}
          preselectedDoctorInfoId={preselectedDoctor}
        />
      )}
    </div>
  );
}
