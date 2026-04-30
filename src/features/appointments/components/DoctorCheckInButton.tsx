import { Button, Chip } from "@heroui/react";
import { CheckCircle, LogIn } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDoctorCheckIn } from "../appointmentsHooks";
import type { AppointmentType, DoctorCheckInResult } from "../types";
import { DelayHandlingDialog } from "./DelayHandlingDialog";

interface DoctorCheckInButtonProps {
  doctorInfoId: string;
  branchId: string;
  doctorName: string;
  hasSessionToday: boolean;
  appointmentType?: AppointmentType;
}

export function DoctorCheckInButton({
  doctorInfoId,
  branchId,
  doctorName,
  hasSessionToday,
  appointmentType,
}: DoctorCheckInButtonProps) {
  const { t } = useTranslation();
  const checkIn = useDoctorCheckIn();
  const [delayResult, setDelayResult] = useState<DoctorCheckInResult | null>(null);
  const [checkedIn, setCheckedIn] = useState(hasSessionToday);

  // Already checked in today — show a green badge instead of the button
  if (checkedIn) {
    return (
      <Chip size="sm" variant="soft" color="success" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        {t("appointments.sessionActive")}
      </Chip>
    );
  }

  const handleCheckIn = () => {
    checkIn.mutate(
      { doctorInfoId, branchId },
      {
        onSuccess: (result) => {
          setCheckedIn(true);
          // Show delay dialog for time-based doctors when late.
          // Queue doctors: just start the queue — no rescheduling needed.
          if (result.isLate && appointmentType !== "Queue") {
            setDelayResult(result);
          }
        },
        onError: (err: any) => {
          if (err?.code === "ALREADY_EXISTS") setCheckedIn(true);
        },
      },
    );
  };

  return (
    <>
      <Button
        size="sm"
        variant="outline"
        onPress={handleCheckIn}
        isPending={checkIn.isPending}
        className="gap-1.5"
      >
        <LogIn className="h-3.5 w-3.5" />
        {t("appointments.checkIn")}
      </Button>

      {delayResult && (
        <DelayHandlingDialog
          isOpen
          sessionId={delayResult.sessionId}
          delayMinutes={delayResult.delayMinutes ?? 0}
          scheduledTime={delayResult.scheduledStartTime}
          doctorName={doctorName}
          onClose={() => setDelayResult(null)}
        />
      )}
    </>
  );
}
