import { Button } from "@heroui/react";
import { LogIn } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useDoctorCheckIn } from "../appointmentsHooks";
import type { DoctorCheckInResult } from "../types";
import { DelayHandlingDialog } from "./DelayHandlingDialog";

interface DoctorCheckInButtonProps {
  doctorInfoId: string;
  branchId: string;
  doctorName: string;
}

export function DoctorCheckInButton({ doctorInfoId, branchId, doctorName }: DoctorCheckInButtonProps) {
  const { t } = useTranslation();
  const checkIn = useDoctorCheckIn();
  const [delayResult, setDelayResult] = useState<DoctorCheckInResult | null>(null);

  const handleCheckIn = () => {
    checkIn.mutate({ doctorInfoId, branchId }, {
      onSuccess: (result) => {
        if (result.isLate) {
          setDelayResult(result);
        }
      },
    });
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
