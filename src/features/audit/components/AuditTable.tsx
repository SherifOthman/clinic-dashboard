import { DataTable } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import type { AuditAction, AuditLogItem, AuditLogsResponse } from "../types";

const ACTION_COLORS: Record<
  AuditAction,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  Create: "success",
  Update: "warning",
  Delete: "danger",
  Security: "accent",
  Restore: "default",
};

const AUTH_EVENT_LABELS: Record<string, string> = {
  LoginSuccess: "Login",
  LoginFailed: "Failed login",
  LoginBlocked: "Login blocked",
  AccountLocked: "Account locked",
  Logout: "Logout",
};

/** Extract the most meaningful identifier from the changes JSON snapshot */
function extractSubject(item: AuditLogItem): string | null {
  if (!item.changes) return null;
  try {
    const parsed = JSON.parse(item.changes);
    if (item.entityType === "Auth")
      return parsed.event
        ? (AUTH_EVENT_LABELS[parsed.event] ?? parsed.event)
        : null;
    const name =
      parsed["Full Name"] ?? parsed.FullName ?? parsed.Name ?? parsed.name;
    if (name && typeof name === "string") return name;
    const nameChange = parsed["Full Name"] ?? parsed.FullName;
    if (nameChange && typeof nameChange === "object" && "New" in nameChange)
      return nameChange.New;
    const email = parsed.Email ?? parsed.email ?? parsed.UserEmail;
    if (email && typeof email === "string") return email;
    return null;
  } catch {
    return null;
  }
}

interface AuditTableProps {
  data: AuditLogsResponse | undefined;
  isLoading: boolean;
  pageNumber: number;
  onRowClick: (item: AuditLogItem) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

export function AuditTable({
  data,
  isLoading,
  pageNumber,
  onRowClick,
  onPageChange,
  onPageSizeChange,
}: AuditTableProps) {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === "ar";
  const { formatDateOnly, formatTimeOnly } = useDateFormat();

  const actionLabel = (a: AuditAction) => t(`audit.actions.${a}`);

  const columns = [
    // 1. Action (most important — what happened)
    {
      key: "action",
      label: t("audit.action"),
      render: (item: AuditLogItem) => (
        <Chip
          size="sm"
          variant="soft"
          color={ACTION_COLORS[item.action]}
          className="w-fit"
        >
          {actionLabel(item.action)}
        </Chip>
      ),
    },
    // 2. Entity + subject (what was affected)
    {
      key: "entityType",
      label: t("audit.entity"),
      render: (item: AuditLogItem) => {
        const subject = extractSubject(item);
        return (
          <div className="flex flex-col gap-0.5">
            <span className="text-sm font-medium">{item.entityType}</span>
            {subject && <span className="text-muted text-xs">{subject}</span>}
          </div>
        );
      },
    },
    // 3. Performed by
    {
      key: "userName",
      label: t("audit.performedBy"),
      render: (item: AuditLogItem) => (
        <div className="flex flex-col gap-0.5">
          <span className="text-sm font-medium">{item.fullName ?? "—"}</span>
          {item.userRole && (
            <span className="text-muted text-xs">
              {item.userRole.split(",")[0]}
            </span>
          )}
        </div>
      ),
    },
    // 4. Timestamp (secondary)
    {
      key: "timestamp",
      label: t("audit.timestamp"),
      render: (item: AuditLogItem) => (
        <div
          className={`flex flex-col gap-0.5 ${isRTL ? "items-end" : "items-start"}`}
          dir="ltr"
        >
          <span className="text-muted text-sm">
            {formatDateOnly(item.timestamp)}
          </span>
          <span className="text-muted text-xs">
            {formatTimeOnly(item.timestamp)}
          </span>
        </div>
      ),
    },
    // 5. Clinic (least important — only relevant for SuperAdmin)
    {
      key: "clinicId",
      label: t("audit.clinic"),
      render: (item: AuditLogItem) =>
        item.clinicName ? (
          <span className="text-muted text-sm">{item.clinicName}</span>
        ) : (
          <span className="text-muted text-xs">System</span>
        ),
    },
  ];

  return (
    <>
      <DataTable
        key={i18n.language}
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage={t("audit.noLogs")}
        onRowClick={onRowClick}
      />

      <TablePagination
        data={data}
        currentPage={pageNumber}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
      />
    </>
  );
}
