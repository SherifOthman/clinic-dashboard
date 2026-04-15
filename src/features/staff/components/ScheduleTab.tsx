import { Button, Card, Modal, Switch } from "@heroui/react";
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
  const { data: branches = [], isLoading: branchesLoading } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const setLock = useSetScheduleLock();

  const activeBranchId = selectedBranchId ?? branches[0]?.id ?? null;
  const activeBranch = branches.find((b) => b.id === activeBranchId);
  const { data: workingDays = [] } = useWorkingDays(
    staffId,
    activeBranchId ?? undefined,
  );
  const readOnly = !isOwner && !canSelfManageSchedule;

  return (
    <div className="flex flex-col gap-4">
      {/* Schedule lock toggle — owner only */}
      {isOwner && (
        <Card>
          <Card.Content className="py-3">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-medium">
                  {t("staff.allowSelfManage")}
                </p>
                <p className="text-default-400 text-xs">
                  {t("staff.allowSelfManageDesc")}
                </p>
              </div>
              <Switch
                isSelected={canSelfManageSchedule}
                onChange={(val) =>
                  setLock.mutate({ staffId, canSelfManage: val })
                }
                isDisabled={setLock.isPending}
                size="sm"
                aria-label={t("staff.allowSelfManage")}
              >
                <Switch.Control>
                  <Switch.Thumb />
                </Switch.Control>
              </Switch>
            </div>
          </Card.Content>
        </Card>
      )}

      {/* Locked banner */}
      {!isOwner && !canSelfManageSchedule && (
        <div className="border-warning/30 bg-warning/10 text-warning flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium">
          <Lock className="h-4 w-4 shrink-0" />
          {t("staff.scheduleLockedByOwner")}
        </div>
      )}

      {/* Main card: branch selector + working days + visit types */}
      <Card>
        {/* Branch selector header */}
        <Card.Header className="pb-0">
          <div className="flex w-full flex-wrap items-center gap-2">
            <span className="text-default-500 text-xs font-medium">
              {t("branches.title")}:
            </span>
            {branchesLoading ? (
              <div className="bg-default-100 h-6 w-24 animate-pulse rounded-lg" />
            ) : branches.length === 0 ? (
              <span className="text-default-400 text-xs">
                {t("branches.noBranches")}
              </span>
            ) : (
              branches.map((b) => (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => setSelectedBranchId(b.id)}
                  className={`rounded-lg px-3 py-1 text-xs font-medium transition-all ${
                    activeBranchId === b.id
                      ? "bg-accent text-white"
                      : "bg-default text-muted hover:text-foreground"
                  }`}
                >
                  {b.name}
                </button>
              ))
            )}
          </div>
        </Card.Header>

        {activeBranchId && (
          <>
            {/* Working days section */}
            <Card.Content className="pt-4 pb-0">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-sm font-semibold">
                  {t("staff.workingDays")}
                </span>
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
            </Card.Content>

            <div className="border-divider mx-4 border-t" />

            {/* Visit types section */}
            <Card.Content className="pt-4">
              <p className="mb-3 text-sm font-semibold">
                {t("staff.visitTypes")}
              </p>
              <VisitTypesEditor
                staffId={staffId}
                branchId={activeBranchId}
                readOnly={readOnly}
              />
            </Card.Content>
          </>
        )}
      </Card>

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
