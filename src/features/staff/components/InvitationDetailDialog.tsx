import { Dialog } from "@/core/components/ui/Dialog";
import { Loading } from "@/core/components/ui/Loading";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { getLocalizedValue } from "@/core/utils/i18nUtils";
import { Chip } from "@heroui/react";
import {
  CalendarCheck,
  CalendarClock,
  CalendarX,
  Mail,
  UserCheck,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { useInvitationDetail } from "../staffHooks";
import { InvitationStatus } from "../types";

const STATUS_COLOR: Record<
  InvitationStatus,
  "warning" | "success" | "danger" | "default"
> = {
  [InvitationStatus.Pending]: "warning",
  [InvitationStatus.Accepted]: "success",
  [InvitationStatus.Canceled]: "danger",
  [InvitationStatus.Expired]: "default",
};

interface InvitationDetailDialogProps {
  invitationId: string | null;
  onClose: () => void;
}

export function InvitationDetailDialog({
  invitationId,
  onClose,
}: InvitationDetailDialogProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { formatDateShort, formatTimeOnly } = useDateFormat();
  const { data, isLoading } = useInvitationDetail(invitationId);

  const isExpiredOrCanceled =
    data?.status === InvitationStatus.Expired ||
    data?.status === InvitationStatus.Canceled;

  return (
    <Dialog isOpen={!!invitationId} onClose={onClose} size="sm">
      {isLoading ? (
        <Loading className="h-40" />
      ) : data ? (
        <div className="flex flex-col gap-5">
          {/* ── Header ── */}
          <div className="flex flex-col items-center gap-3 pt-1 text-center">
            <div className="bg-accent-soft flex h-14 w-14 items-center justify-center rounded-2xl">
              <Mail className="text-accent h-6 w-6" />
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-foreground text-base font-bold break-all">
                {data.email}
              </p>
              <div className="flex flex-wrap justify-center gap-1.5">
                <Chip
                  size="sm"
                  variant="soft"
                  color={STATUS_COLOR[data.status]}
                >
                  {t(`staff.invitationStatus.${InvitationStatus[data.status]}`)}
                </Chip>
                <Chip size="sm" variant="soft" color="default">
                  {t(`staff.roles.${data.role}`, { defaultValue: data.role })}
                </Chip>
                {(data.specializationNameEn || data.specializationNameAr) && (
                  <Chip size="sm" variant="soft" color="accent">
                    {getLocalizedValue(
                      isRTL,
                      data.specializationNameAr,
                      data.specializationNameEn,
                    )}
                  </Chip>
                )}
              </div>
            </div>
          </div>

          <div className="border-divider border-t" />

          {/* ── People ── */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-default rounded-xl p-3">
              <div className="mb-1 flex items-center gap-1.5">
                <UserCheck className="text-muted h-3.5 w-3.5" />
                <span className="text-muted text-xs">
                  {t("staff.invitedBy")}
                </span>
              </div>
              <p className="text-foreground text-sm font-semibold">
                {data.invitedBy}
              </p>
            </div>
            {data.acceptedBy && (
              <div className="bg-default rounded-xl p-3">
                <div className="mb-1 flex items-center gap-1.5">
                  <UserCheck className="text-muted h-3.5 w-3.5" />
                  <span className="text-muted text-xs">
                    {t("staff.acceptedBy")}
                  </span>
                </div>
                <p className="text-foreground text-sm font-semibold">
                  {data.acceptedBy}
                </p>
              </div>
            )}
          </div>

          {/* ── Timeline ── */}
          <div>
            <p className="text-foreground mb-2 text-sm font-semibold">
              Timeline
            </p>
            <div className="divide-divider divide-y">
              {[
                {
                  icon: <CalendarClock className="h-4 w-4" />,
                  label: t("staff.invitedAt"),
                  date: data.invitedAt,
                  muted: false,
                },
                {
                  icon: <CalendarX className="h-4 w-4" />,
                  label: t("staff.expiresAt"),
                  date: data.expiresAt,
                  muted: isExpiredOrCanceled,
                },
                ...(data.acceptedAt
                  ? [
                      {
                        icon: <CalendarCheck className="h-4 w-4" />,
                        label: t("staff.acceptedAt"),
                        date: data.acceptedAt,
                        muted: false,
                      },
                    ]
                  : []),
              ].map((row, i) => (
                <div
                  key={i}
                  className={`flex items-center gap-3 py-2.5 ${row.muted ? "opacity-40" : ""}`}
                >
                  <div className="bg-default flex h-8 w-8 shrink-0 items-center justify-center rounded-lg">
                    <span className="text-accent">{row.icon}</span>
                  </div>
                  <span className="text-foreground flex-1 text-sm">
                    {row.label}
                  </span>
                  <div className="flex flex-col items-end">
                    <span
                      className="text-foreground text-sm font-semibold"
                      dir="ltr"
                    >
                      {formatDateShort(row.date)}
                    </span>
                    <span className="text-accent text-xs" dir="ltr">
                      {formatTimeOnly(row.date)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </Dialog>
  );
}
