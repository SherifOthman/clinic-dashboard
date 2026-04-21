import { Button, Card, Modal, Switch, Tabs } from "@heroui/react";
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
  /** compact = inside a narrow dialog; default = full page with two columns */
  compact?: boolean;
}

export function ScheduleTab({
  staffId,
  isOwner,
  canSelfManageSchedule,
  compact = false,
}: ScheduleTabProps) {
  const { t } = useTranslation();
  const {
    data: branches = [],
    isLoading: branchesLoading,
    isError: branchesError,
  } = useBranches();
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const setLock = useSetScheduleLock();

  const activeBranchId = selectedBranchId ?? branches[0]?.id ?? null;
  const { data: workingDays = [] } = useWorkingDays(
    staffId,
    activeBranchId ?? undefined,
  );
  const readOnly = !isOwner && !canSelfManageSchedule;

  return (
    <div className="flex flex-col gap-4">
      {/* Lock toggle — owner only */}
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

      {/* Branch selector */}
      <div className="flex flex-wrap items-center gap-2">
        <span className="text-default-500 text-sm font-medium">
          {t("branches.title")}:
        </span>
        {branchesLoading ? (
          <div className="bg-default-100 h-7 w-28 animate-pulse rounded-lg" />
        ) : branchesError ? (
          <span className="text-danger text-sm">{t("branches.loadError")}</span>
        ) : branches.length === 0 ? (
          <span className="text-default-400 text-sm">
            {t("branches.noBranches")}
          </span>
        ) : (
          branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBranchId(b.id)}
              className={`rounded-lg px-4 py-1.5 text-sm font-medium transition-all ${
                activeBranchId === b.id
                  ? "bg-accent text-white shadow-sm"
                  : "bg-default text-muted hover:text-foreground"
              }`}
            >
              {b.name}
            </button>
          ))
        )}
      </div>

      {activeBranchId &&
        (compact ? (
          /* ── Compact (dialog): sub-tabs for working days and visit types ── */
          <Tabs defaultSelectedKey="working-days">
            <Tabs.ListContainer>
              <Tabs.List aria-label={t("staff.scheduleTabs")}>
                <Tabs.Tab id="working-days">
                  {t("staff.workingDays")}
                  <Tabs.Indicator />
                </Tabs.Tab>
                <Tabs.Tab id="visit-types">
                  {t("staff.visitTypes")}
                  <Tabs.Indicator />
                </Tabs.Tab>
              </Tabs.List>
            </Tabs.ListContainer>

            <Tabs.Panel id="working-days" className="pt-3">
              <div className="flex justify-end pb-2">
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
            </Tabs.Panel>

            <Tabs.Panel id="visit-types" className="pt-3">
              <VisitTypesEditor
                staffId={staffId}
                branchId={activeBranchId}
                readOnly={readOnly}
              />
            </Tabs.Panel>
          </Tabs>
        ) : (
          /* ── Full page: two columns, working days inline ── */
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
            <Card>
              <Card.Header>
                <Card.Title className="text-base">
                  {t("staff.workingDays")}
                </Card.Title>
              </Card.Header>
              <Card.Content className="pt-0">
                <WorkingDaysEditor
                  staffId={staffId}
                  branchId={activeBranchId}
                  initialData={workingDays}
                  inline
                  readOnly={readOnly}
                />
              </Card.Content>
            </Card>

            <Card>
              <Card.Header>
                <Card.Title className="text-base">
                  {t("staff.visitTypes")}
                </Card.Title>
              </Card.Header>
              <Card.Content className="pt-0">
                <VisitTypesEditor
                  staffId={staffId}
                  branchId={activeBranchId}
                  readOnly={readOnly}
                />
              </Card.Content>
            </Card>
          </div>
        ))}

      {/* Working days modal — compact mode only */}
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
