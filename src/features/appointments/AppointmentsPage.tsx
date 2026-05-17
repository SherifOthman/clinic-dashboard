import { PageHeader } from "@/core/components/ui/PageHeader";
import { useDialogState } from "@/core/hooks/useDialogState";
import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { DateValue } from "@internationalized/date";
import { getLocalTimeZone } from "@internationalized/date";
import { useState } from "react";
import { useBranches } from "../branches/branchesHooks";
import { useWorkingDays } from "../staff/staffQueries";
import { PatientDetailDialog } from "@/features/patients/components/PatientDetailDialog";
import { useAppointments, useDoctorsForBranch } from "./appointmentsHooks";
import { useAppointmentsTableState } from "./appointmentsTableState";
import { AppointmentsToolbar } from "./components/AppointmentsToolbar";
import { CreateAppointmentDialog } from "./components/CreateAppointmentDialog";
import { DelayHandlingDialog } from "./components/DelayHandlingDialog";
import { DoctorAppointmentsPanel } from "./components/DoctorAppointmentsPanel";
import type { AppointmentDto, DoctorCheckInResult } from "./types";

export default function AppointmentsPage() {
  const { t } = useTranslation();
  const { state, update } = useAppointmentsTableState();

  const [preselectedDoctor, setPreselectedDoctor] = useState<string | undefined>();
  const [editingAppt, setEditingAppt]             = useState<AppointmentDto | null>(null);
  const [viewPatientId, setViewPatientId]         = useState<string | null>(null);
  const [pendingDelay, setPendingDelay]           = useState<{ result: DoctorCheckInResult; doctorName: string } | null>(null);

  const createDialog = useDialogState();

  // ── Data ───────────────────────────────────────────────────────────────────
  const { data: branches = [] } = useBranches();
  const activeBranchId = state.branchId ?? branches[0]?.id ?? null;

  const { data: doctors = [], isLoading: doctorsLoading } = useDoctorsForBranch(activeBranchId);

  // Show only the selected doctor (or the first one when there's only one)
  const effectiveDoctorId = state.doctorId ?? doctors[0]?.doctorInfoId;
  const visibleDoctors = doctors.length > 1
    ? doctors.filter((d) => d.doctorInfoId === effectiveDoctorId)
    : doctors;

  // Disable non-working days in the date picker
  const selectedDoctor = doctors.find((d) => d.doctorInfoId === effectiveDoctorId);
  const { data: workingDays = [] } = useWorkingDays(selectedDoctor?.memberId ?? null, activeBranchId ?? undefined);
  const workingDayNumbers = new Set(workingDays.filter((d) => d.isAvailable).map((d) => d.day));
  const isDateUnavailable = (d: DateValue) =>
    workingDays.length > 0 && !workingDayNumbers.has(d.toDate(getLocalTimeZone()).getDay());

  const { data: appointments = [], isLoading: apptLoading } = useAppointments(
    state.dateStr,
    activeBranchId,
    visibleDoctors.length > 0 ? visibleDoctors.map((d) => d.doctorInfoId) : undefined,
    {
      searchTerm:    state.searchTerm  || undefined,
      visitTypeName: state.visitType   || undefined,
      isPaid:        state.payment === "paid" ? true : state.payment === "unpaid" ? false : undefined,
    },
  );

  const isLoading = doctorsLoading || apptLoading;

  // ── Handlers ───────────────────────────────────────────────────────────────
  const openCreate = (doctorInfoId?: string) => {
    setPreselectedDoctor(doctorInfoId);
    createDialog.openCreate();
  };

  const handleBranchChange = (branchId: string | undefined) => {
    update({ branchId, doctorId: undefined });
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

      <AppointmentsToolbar
        state={state}
        onUpdate={update}
        isDateUnavailable={isDateUnavailable}
        branches={branches}
        activeBranchId={activeBranchId}
        onBranchChange={handleBranchChange}
        doctors={doctors}
        effectiveDoctorId={effectiveDoctorId}
        appointments={appointments}
      />

      {visibleDoctors.length === 0 && !isLoading ? (
        <div className="rounded-xl border border-border bg-surface py-16 text-center text-muted">
          {t("appointments.noDoctors")}
        </div>
      ) : (
        <div className="flex flex-col gap-5">
          {visibleDoctors.map((doctor) => (
            <DoctorAppointmentsPanel
              key={doctor.doctorInfoId}
              doctor={doctor}
              appointments={appointments.filter((a) => a.doctorInfoId === doctor.doctorInfoId)}
              isLoading={isLoading}
              dateStr={state.dateStr}
              branchId={activeBranchId ?? undefined}
              onAddAppointment={() => openCreate(doctor.doctorInfoId)}
              onEditAppointment={setEditingAppt}
              onViewPatient={setViewPatientId}
              onDoctorLate={(result, doctorName) => setPendingDelay({ result, doctorName })}
            />
          ))}
        </div>
      )}

      {activeBranchId && createDialog.state.mode !== "closed" && (
        <CreateAppointmentDialog
          isOpen
          onClose={createDialog.close}
          branchId={activeBranchId}
          doctors={doctors}
          preselectedDoctorInfoId={preselectedDoctor}
        />
      )}

      {activeBranchId && editingAppt && (
        <CreateAppointmentDialog
          isOpen
          onClose={() => setEditingAppt(null)}
          branchId={activeBranchId}
          doctors={doctors}
          preselectedDoctorInfoId={editingAppt.doctorInfoId}
          editingAppointment={editingAppt}
        />
      )}

      <PatientDetailDialog
        patientId={viewPatientId}
        onClose={() => setViewPatientId(null)}
      />

      {pendingDelay && (
        <DelayHandlingDialog
          isOpen
          sessionId={pendingDelay.result.sessionId}
          delayMinutes={pendingDelay.result.delayMinutes ?? 0}
          scheduledTime={pendingDelay.result.scheduledStartTime}
          doctorName={pendingDelay.doctorName}
          onClose={() => setPendingDelay(null)}
        />
      )}
    </div>
  );
}
