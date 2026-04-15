import { Button, Modal, Switch } from "@heroui/react";
import { Building2, Lock, Pencil } from "lucide-react";
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

  // ── Schedule lock toggle (owner only) ────────────────────────────────────
  const lockToggle = isOwner && (
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
  );

  // ── Locked banner (doctor view) ───────────────────────────────────────────
  const lockedBanner = !isOwner && !canSelfManageSchedule && (
    <div className="border-warning/30 bg-warning/10 text-warning flex items-center gap-2 rounded-xl border px-4 py-3 text-sm font-medium">
      <Lock className="h-4 w-4 shrink-0" />
      {t("staff.scheduleLockedByOwner")}
    </div>
  );

  if (branchesLoading) {
    return (
      <div className="flex flex-col gap-3">
        {lockToggle}
        <div className="bg-default-100 h-10 animate-pulse rounded-xl" />
      </div>
    );
  }

  if (branches.length === 0) {
    return (
      <div className="flex flex-col gap-3">
        {lockToggle}
        <p className="text-default-400 text-sm">{t("branches.noBranches")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      {lockToggle}
      {lockedBanner}

      {/* ── Branch selector — always visible ─────────────────────────────── */}
      <div>
        <div className="mb-2 flex items-center gap-1.5">
          <Building2 className="text-default-400 h-3.5 w-3.5" />
          <span className="text-default-500 text-xs font-medium tracking-wide uppercase">
            {t("branches.title")}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {branches.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => setSelectedBranchId(b.id)}
              className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                activeBranchId === b.id
                  ? "border-accent bg-accent text-white shadow-sm"
                  : "border-divider text-muted hover:border-accent/40 hover:text-foreground"
              }`}
            >
              {b.name}
            </button>
          ))}
        </div>
      </div>

      {/* ── Content for selected branch ───────────────────────────────────── */}
      {activeBranchId && (
        <>
          {/* Working days */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold">
                  {t("staff.workingDays")}
                </h3>
                <p className="text-default-400 text-xs">{activeBranch?.name}</p>
              </div>
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
            <div className="mb-3">
              <h3 className="text-sm font-semibold">{t("staff.visitTypes")}</h3>
              <p className="text-default-400 text-xs">{activeBranch?.name}</p>
            </div>
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
