import { Dialog } from "@/core/components/ui/Dialog";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { useToast } from "@/core/hooks/useToast";
import { Button, Chip } from "@heroui/react";
import { Globe, RotateCcw, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { ACTION_COLORS } from "../auditConstants";
import { extractSubject, parseUserAgent } from "../auditHelpers";
import { useRestorePatient } from "../auditHooks";
import type { AuditLogItem } from "../types";
import { JsonViewer } from "./JsonViewer";

interface AuditDetailDialogProps {
  item: AuditLogItem | null;
  isRTL: boolean;
  onClose: () => void;
}

function InfoCard({
  title,
  icon,
  rows,
}: {
  title: string;
  icon?: React.ReactNode;
  rows: { label: string; value: React.ReactNode }[];
}) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-1.5">
        {icon && <span className="text-muted">{icon}</span>}
        <p className="text-foreground text-sm font-semibold">{title}</p>
      </div>
      <div className="bg-default divide-divider divide-y overflow-hidden rounded-xl">
        {rows.map((row, i) => (
          <div
            key={i}
            className="flex items-start justify-between gap-4 px-4 py-2.5"
          >
            <span className="text-muted shrink-0 text-xs">{row.label}</span>
            <span className="text-foreground text-right text-xs font-medium">
              {row.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuditDetailDialog({
  item,
  isRTL,
  onClose,
}: AuditDetailDialogProps) {
  const { t } = useTranslation();
  const { formatDateOnly, formatTimeOnly } = useDateFormat();
  const { showSuccess, showError } = useToast();

  const restorePatient = useRestorePatient(() => {
    showSuccess("toast.patientRestoredSuccessfully");
    onClose();
  });

  const actionLabel = (a: string) => t(`audit.actions.${a}`);

  const buildSummary = (log: AuditLogItem): string => {
    const who = log.fullName ?? log.username ?? "Someone";
    const verb = actionLabel(log.action).toLowerCase();
    const subject = extractSubject(log);
    const what = subject ? `${log.entityType} "${subject}"` : log.entityType;
    return `${who} ${verb} ${what}`;
  };

  const canRestore =
    item?.action === "Delete" && item?.entityType === "Patient";

  const restoreFooter = canRestore ? (
    <Button
      variant="outline"
      size="sm"
      className="w-full"
      isDisabled={restorePatient.isPending}
      isPending={restorePatient.isPending}
      onPress={() =>
        restorePatient.mutate(item!.entityId, {
          onError: () => showError("toast.patientRestoreFailed"),
        })
      }
    >
      <RotateCcw className="h-4 w-4" />
      {t("audit.restoreEntity")}
    </Button>
  ) : undefined;

  return (
    <Dialog isOpen={!!item} onClose={onClose} size="lg" footer={restoreFooter}>
      {item && (
        <div className="flex flex-col gap-5">
          {/* ── Header ── */}
          <div className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-foreground text-xl font-bold">
                {item.entityType}
              </h2>
              <p className="text-muted text-sm">{buildSummary(item)}</p>
            </div>
            <div className="flex shrink-0 flex-col items-end gap-1.5">
              <Chip size="sm" variant="soft" color={ACTION_COLORS[item.action]}>
                {actionLabel(item.action)}
              </Chip>
              <span className="text-muted text-xs" dir="ltr">
                {formatDateOnly(item.timestamp)} ·{" "}
                <span className="text-accent">
                  {formatTimeOnly(item.timestamp)}
                </span>
              </span>
            </div>
          </div>

          <div className="border-divider border-t" />

          {/* ── Two-column cards ── */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <InfoCard
              title={t("audit.entity")}
              rows={[
                {
                  label: t("audit.entityId"),
                  value: (
                    <span className="font-mono break-all">{item.entityId}</span>
                  ),
                },
                {
                  label: t("audit.clinic"),
                  value: item.clinicName ?? "System",
                },
                ...(item.clinicId
                  ? [
                      {
                        label: t("audit.clinicId"),
                        value: (
                          <span className="font-mono break-all">
                            {item.clinicId}
                          </span>
                        ),
                      },
                    ]
                  : []),
              ]}
            />
            <InfoCard
              title={t("audit.performedBy")}
              icon={<User className="h-3.5 w-3.5" />}
              rows={[
                {
                  label: t("audit.fullName"),
                  value: (
                    <span className="font-semibold">
                      {item.fullName ?? "—"}
                    </span>
                  ),
                },
                ...(item.username
                  ? [{ label: t("audit.username"), value: `@${item.username}` }]
                  : []),
                ...(item.userEmail
                  ? [
                      {
                        label: t("audit.userEmail"),
                        value: (
                          <span className="text-accent">{item.userEmail}</span>
                        ),
                      },
                    ]
                  : []),
                ...(item.userRole
                  ? [{ label: t("audit.userRole"), value: item.userRole }]
                  : []),
              ]}
            />
            {(item.ipAddress || item.userAgent) && (
              <div className="sm:col-span-2">
                <InfoCard
                  title={t("audit.ip")}
                  icon={<Globe className="h-3.5 w-3.5" />}
                  rows={[
                    ...(item.ipAddress
                      ? [
                          {
                            label: t("audit.ip"),
                            value: (
                              <span className="font-mono">
                                {item.ipAddress}
                              </span>
                            ),
                          },
                        ]
                      : []),
                    ...(item.userAgent
                      ? [
                          {
                            label: t("audit.userAgent"),
                            value: parseUserAgent(item.userAgent),
                          },
                        ]
                      : []),
                  ]}
                />
              </div>
            )}
          </div>

          {/* ── Changes ── */}
          {item.changes && (
            <div>
              <p className="text-foreground mb-2 text-sm font-semibold">
                {t("audit.changes")}
              </p>
              <JsonViewer
                json={item.changes}
                isRTL={isRTL}
                action={item.action}
              />
            </div>
          )}
        </div>
      )}
    </Dialog>
  );
}
