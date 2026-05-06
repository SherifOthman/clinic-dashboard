import { Button, Chip } from "@heroui/react";
import { CheckCircle, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDoctorCheckIn } from "../appointmentsHooks";
import type { AppointmentType, DoctorCheckInResult } from "../types";

interface DoctorCheckInButtonProps {
  doctorInfoId: string;
  branchId: string;
  hasSessionToday: boolean;
  appointmentType: AppointmentType;
  /** Called with the API result when check-in succeeds, doctor is late, and type is Time. */
  onLate: (result: DoctorCheckInResult) => void;
}

export function DoctorCheckInButton({
  doctorInfoId,
  branchId,
  hasSessionToday,
  appointmentType,
  onLate,
}: DoctorCheckInButtonProps) {
  const { t } = useTranslation();
  const checkIn = useDoctorCheckIn();

  if (hasSessionToday) {
    return (
      <Chip size="sm" variant="soft" color="success" className="gap-1">
        <CheckCircle className="h-3 w-3" />
        {t("appointments.sessionActive")}
      </Chip>
    );
  }

  return (
    <Button
      size="sm"
      variant="outline"
      onPress={() =>
        checkIn.mutate(
          { doctorInfoId, branchId },
          {
            onSuccess: (result) => {
              // Only Time-based doctors have scheduled appointments that can be shifted.
              // Queue doctors don't have fixed times — the delay dialog is irrelevant for them.
              if (result.isLate && appointmentType === "Time") {
                onLate(result);
              }
            },
          },
        )
      }
      isPending={checkIn.isPending}
      className="gap-1.5"
    >
      <LogIn className="h-3.5 w-3.5" />
      {t("appointments.checkIn")}
    </Button>
  );
}
