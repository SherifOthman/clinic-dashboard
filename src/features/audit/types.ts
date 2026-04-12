import type { BaseSearchParams, PagedResult } from "@/core/types";

export type AuditAction =
  | "Create"
  | "Update"
  | "Delete"
  | "Security"
  | "Restore";

export interface AuditLogItem {
  id: string;
  timestamp: string;
  clinicId?: string;
  clinicName?: string;
  userId?: string;
  fullName?: string;
  username?: string;
  userEmail?: string;
  userRole?: string;
  userAgent?: string; // browser/device info
  entityType: string;
  entityId: string;
  action: AuditAction;
  ipAddress?: string;
  changes?: string;
}

/** Alias for PagedResult<AuditLogItem> — kept for readability at call sites */
export type AuditLogsResponse = PagedResult<AuditLogItem>;

export interface AuditSearchParams extends BaseSearchParams {
  entityType?: string;
  entityId?: string;
  action?: AuditAction;
  from?: string;
  to?: string;
  userSearch?: string;
  clinicSearch?: string;
}
