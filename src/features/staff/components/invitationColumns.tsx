import type { Column } from "@/core/components/ui/DataTable";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { Button, Chip, Tooltip } from "@heroui/react";
import type { TFunction } from "i18next";
import { RefreshCw, X } from "lucide-react";
import { InvitationDto, InvitationStatus } from "../types";

const STATUS_COLOR: Record<
  InvitationStatus,
  "warning" | "success" | "danger" | "default"
> = {
  [InvitationStatus.Pending]: "warning",
  [InvitationStatus.Accepted]: "success",
  [InvitationStatus.Canceled]: "danger",
  [InvitationStatus.Expired]: "default",
};

interface InvitationColumnsOptions {
  t: TFunction;
  isRTL: boolean;
  formatDate: (date: string) => string;
  onCancel: (invitation: InvitationDto) => void;
  onResend: (invitation: InvitationDto) => void;
  pendingId?: string;
}

export function getInvitationColumns({
  t,
  isRTL,
  formatDate,
  onCancel,
  onResend,
  pendingId,
}: InvitationColumnsOptions): Column<InvitationDto>[] {
  return [
    // 1. Email (identity)
    {
      key: "email",
      label: t("common.fields.email"),
      sortable: true,
    },
    // 2. Role
    {
      key: "role",
      label: t("common.fields.role"),
      render: (item) => (
        <span className="font-medium">
          {t(`staff.roles.${item.role}`, { defaultValue: item.role })}
        </span>
      ),
    },
    // 3. Status
    {
      key: "status",
      label: t("common.fields.status"),
      render: (item) => (
        <Chip size="sm" variant="soft" color={STATUS_COLOR[item.status]}>
          {t(`staff.invitationStatus.${InvitationStatus[item.status]}`)}
        </Chip>
      ),
    },
    // 4. Specialization (secondary — only for doctors)
    {
      key: "specializationNameEn",
      label: t("common.fields.specialization"),
      render: (item) => (
        <span className="text-muted text-sm">
          {getLocalizedValue(
            isRTL,
            item.specializationNameAr,
            item.specializationNameEn,
          ) ?? "—"}
        </span>
      ),
    },
    // 5. Invited by (secondary)
    {
      key: "invitedBy",
      label: t("staff.invitedBy"),
      render: (item) => (
        <span className="text-muted text-sm">{item.invitedBy ?? "—"}</span>
      ),
    },
    // 6. Invited at
    {
      key: "invitedAt",
      label: t("staff.invitedAt"),
      sortable: true,
      render: (item) => (
        <span dir="ltr" className="text-muted text-sm">
          {formatDate(item.invitedAt)}
        </span>
      ),
    },
    // 7. Expires at (least important)
    {
      key: "expiresAt",
      label: t("staff.expiresAt"),
      render: (item) => (
        <span dir="ltr" className="text-muted text-sm">
          {formatDate(item.expiresAt)}
        </span>
      ),
    },
    // 8. Actions
    {
      key: "actions",
      label: t("common.actions"),
      render: (item) => (
        <div className="flex gap-1">
          {(item.status === InvitationStatus.Pending ||
            item.status === InvitationStatus.Expired) && (
            <Tooltip delay={300}>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                isPending={pendingId === item.id}
                isDisabled={!!pendingId}
                onPress={() => onResend(item)}
                aria-label={t("staff.resendInvitation")}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              <Tooltip.Content>
                <p>{t("staff.resendInvitation")}</p>
              </Tooltip.Content>
            </Tooltip>
          )}
          {item.status === InvitationStatus.Pending && (
            <Tooltip delay={300}>
              <Button
                isIconOnly
                size="sm"
                variant="ghost"
                className="text-danger"
                isDisabled={!!pendingId}
                onPress={() => onCancel(item)}
                aria-label={t("staff.cancelInvitation")}
              >
                <X className="h-4 w-4" />
              </Button>
              <Tooltip.Content>
                <p>{t("staff.cancelInvitation")}</p>
              </Tooltip.Content>
            </Tooltip>
          )}
        </div>
      ),
    },
  ];
}
