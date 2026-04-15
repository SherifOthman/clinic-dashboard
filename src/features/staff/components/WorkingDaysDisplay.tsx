import { Button, Modal } from "@heroui/react";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useWorkingDays } from "../staffHooks";
import { WorkingDaysEditor } from "./WorkingDaysEditor";
import { WorkingDaysList } from "./WorkingDaysList";

/**
 * Self-contained working days display with an inline edit button.
 * Used in StaffDetailDialog (non-schedule-tab view).
 */
export function WorkingDaysDisplay({
  staffId,
  branchId,
  hideEditButton = false,
}: {
  staffId: string;
  branchId: string;
  hideEditButton?: boolean;
}) {
  const { t } = useTranslation();
  const { data } = useWorkingDays(staffId, branchId);
  const [isEditOpen, setIsEditOpen] = useState(false);

  return (
    <div className="flex flex-col gap-2">
      {!hideEditButton && (
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold">
            {t("staff.workingDays")}
          </span>
          <Button size="sm" variant="ghost" onPress={() => setIsEditOpen(true)}>
            <Pencil className="h-3.5 w-3.5" />
            {t("common.edit")}
          </Button>
        </div>
      )}

      <WorkingDaysList staffId={staffId} branchId={branchId} />

      <Modal.Backdrop isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <WorkingDaysEditor
                staffId={staffId}
                branchId={branchId}
                initialData={data ?? []}
                onClose={close}
              />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
