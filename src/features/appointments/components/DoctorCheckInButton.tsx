import { Button, Tooltip } from "@heroui/react";
import { LogIn, LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useDoctorCheckIn, useDoctorCheckOut } from "../appointmentsHooks";
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
  const checkIn  = useDoctorCheckIn();
  const checkOut = useDoctorCheckOut();

  // Session active → show checkout button
  if (hasSessionToday) {
    return (
      <Tooltip delay={300}>
        <Tooltip.Trigger>
          <Button
            size="sm"
            variant="ghost"
            onPress={() => checkOut.mutate({ doctorInfoId, branchId })}
            isPending={checkOut.isPending}
            className="gap-1 text-success hover:bg-success/10"
            aria-label={t("appointments.checkOut")}
          >
            <LogOut className="h-3.5 w-3.5" />
            <span className="hidden sm:inline text-xs">{t("appointments.sessionActive")}</span>
          </Button>
        </Tooltip.Trigger>
        <Tooltip.Content>
          <p>{t("appointments.checkOutDesc")}</p>
        </Tooltip.Content>
      </Tooltip>
    );
  }

  // No session → show check-in button
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
