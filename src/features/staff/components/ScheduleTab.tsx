import { Button, Modal, Switch } from "@heroui/react";
import { Lock, Pencil } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useBranches } from "../../branches/branchesHooks";
import { useSetScheduleLock, useWorkingDays } from "../staffHooks";
import { VisitTypesEditor } from "./VisitTypesEditor";
import { WorkingDaysEditor } from "./WorkingDaysEditor";
import { WorkingDaysList } from "./WorkingDaysList";

interface ScheduleTabProps {
  staffId: string;
  isOwner: boolean;
  canSelfManageSchedule: boolean;
}

export function ScheduleTab({
  staffId,
  isOwner,
  canSelfManageSchedule,
}: ScheduleTabProps) {
  const { t } = useTranslation();
  const { data: branches = [] } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const setLock = useSetScheduleLock();

  const activeBranchId = selectedBranchId ?? branches[0]?.id ?? null;
  const { data: workingDays = [] } = useWorkingDays(
    staffId,
    activeBranchId ?? undefined,
  );
  const readOnly = !isOwner && !canSelfManageSchedule;

  if (branches.length === 0) {
    return (
      <p className="text-default-400 text-sm">{t("branches.noBranches")}</p>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Schedule lock toggle — owner only */}
      {isOwner && (
        <div className="bg-default-50 border-divider flex items-center justify-between rounded-xl border px-4 py-3">
          <div>
            <p className="text-sm font-medium">{t("staff.allowSelfManage")}</p>
            <p className="text-default-400 mt-0.5 text-xs">
              {t("staff.allowSelfManageDesc")}
            </p>
          </div>
          <Switch
            isSelected={canSelfManageSchedule}
            onChange={(val) => setLock.mutate({ staffId, canSelfManage: val })}
            isDisabled={setLock.isPending}
            size="sm"
            aria-label={t("staff.allowSelfManage")}
          >
            <Switch.Control>
              <Switch.Thumb />
            </Switch.Control>
          </Switch>
        </div>
      )}

      {/* Locked banner */}
      {!isOwner && !canSelfManageSchedule && (
        <div className="border-warning/30 bg-warning/10 text-warning flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium">
          <Lock className="h-4 w-4 shrink-0" />
          {t("staff.scheduleLockedByOwner")}
        </div>
      )}

      {/* Branch tabs */}
      {branches.length > 1 && (
        <div className="flex flex-wrap gap-1.5">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBranchId(b.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-colors ${
                activeBranchId === b.id
                  ? "bg-accent text-white"
                  : "bg-default text-muted hover:text-foreground"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      )}

      {activeBranchId && (
        <>
          {/* Working days */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold">
                {t("staff.workingDays")}
              </h3>
              {!readOnly && (
                <Button
                  size="sm"
                  variant="ghost"
                  onPress={() => setIsEditOpen(true)}
                >
                  <Pencil className="h-3.5 w-3.5" />
                  {t("common.edit")}
                </Button>
              )}
            </div>
            <WorkingDaysList staffId={staffId} branchId={activeBranchId} />
          </div>

          <div className="border-divider border-t" />

          {/* Visit types */}
          <div>
            <h3 className="mb-3 text-sm font-semibold">
              {t("staff.visitTypes")}
            </h3>
            <VisitTypesEditor
              staffId={staffId}
              branchId={activeBranchId}
              readOnly={readOnly}
            />
          </div>
        </>
      )}

      {/* Working days edit modal */}
      <Modal.Backdrop isOpen={isEditOpen} onOpenChange={setIsEditOpen}>
        <Modal.Container size="sm">
          <Modal.Dialog>
            {({ close }) => (
              <WorkingDaysEditor
                staffId={staffId}
                branchId={activeBranchId!}
                initialData={workingDays}
                onClose={close}
              />
            )}
          </Modal.Dialog>
        </Modal.Container>
      </Modal.Backdrop>
    </div>
  );
}
