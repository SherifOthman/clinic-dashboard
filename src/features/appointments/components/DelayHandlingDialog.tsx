import { Dialog } from "@/core/components/ui/Dialog";
import { Button } from "@heroui/react";
import { AlertTriangle, ArrowRight, Clock, UserX } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useHandleDelay } from "../appointmentsHooks";

interface DelayHandlingDialogProps {
  isOpen: boolean;
  sessionId: string;
  delayMinutes: number;
  scheduledTime?: string;
  doctorName: string;
  onClose: () => void;
}

export function DelayHandlingDialog({
  isOpen,
  sessionId,
  delayMinutes,
  scheduledTime,
  doctorName,
  onClose,
}: DelayHandlingDialogProps) {
  const { t } = useTranslation();
  const handleDelay = useHandleDelay();

  const choose = (option: "AutoShift" | "MarkMissed" | "Manual") => {
    handleDelay.mutate({ sessionId, option }, { onSuccess: onClose });
  };

  const hours   = Math.floor(delayMinutes / 60);
  const minutes = delayMinutes % 60;
  const delayStr = hours > 0 ? `${hours}h ${minutes}m` : `${minutes}m`;

  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      size="md"
      header={
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-warning/10">
            <AlertTriangle className="h-5 w-5 text-warning" />
          </div>
          <div>
            <h2 className="text-lg font-bold">{t("appointments.doctorLate")}</h2>
            <p className="text-sm text-muted">{doctorName}</p>
          </div>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {/* Delay info */}
        <div className="rounded-lg bg-warning/5 border border-warning/20 px-4 py-3">
          <p className="text-sm font-medium text-warning">
            {t("appointments.lateBy", { delay: delayStr })}
          </p>
          {scheduledTime && (
            <p className="text-xs text-muted mt-1">
              {t("appointments.scheduledAt")} {scheduledTime}
            </p>
          )}
        </div>

        <p className="text-sm text-muted">{t("appointments.chooseDelayHandling")}</p>

        {/* Option 1: Auto Shift */}
        <button
          type="button"
          onClick={() => choose("AutoShift")}
          disabled={handleDelay.isPending}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 text-start transition hover:border-accent hover:bg-accent/5 disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-accent/10">
            <ArrowRight className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="font-semibold">{t("appointments.autoShift")}</p>
            <p className="text-sm text-muted">{t("appointments.autoShiftDesc", { delay: delayStr })}</p>
          </div>
        </button>

        {/* Option 2: Mark Missed */}
        <button
          type="button"
          onClick={() => choose("MarkMissed")}
          disabled={handleDelay.isPending}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 text-start transition hover:border-danger hover:bg-danger/5 disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-danger/10">
            <UserX className="h-5 w-5 text-danger" />
          </div>
          <div>
            <p className="font-semibold">{t("appointments.markMissed")}</p>
            <p className="text-sm text-muted">{t("appointments.markMissedDesc")}</p>
          </div>
        </button>

        {/* Option 3: Manual */}
        <button
          type="button"
          onClick={() => choose("Manual")}
          disabled={handleDelay.isPending}
          className="flex items-start gap-4 rounded-xl border border-border bg-surface p-4 text-start transition hover:border-muted disabled:opacity-50"
        >
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-surface-secondary">
            <Clock className="h-5 w-5 text-muted" />
          </div>
          <div>
            <p className="font-semibold">{t("appointments.manualHandling")}</p>
            <p className="text-sm text-muted">{t("appointments.manualHandlingDesc")}</p>
          </div>
        </button>

        <Button variant="ghost" onPress={onClose} className="self-end">
          {t("common.cancel")}
        </Button>
      </div>
    </Dialog>
  );
}
