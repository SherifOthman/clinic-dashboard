import { useBaseTableState } from "@/core/hooks/useTableState";
import type { InvitationsSearchParams, StaffSearchParams } from "./types";
import { InvitationStatus } from "./types";

// ── Staff list table state ────────────────────────────────────────────────────

export function useStaffTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const roleFilter = searchParams.get("role") || undefined;
  const activeFilter = searchParams.get("active") || undefined; // "true" | "false" | undefined

  const staffState: StaffSearchParams = {
    ...baseState,
    role: roleFilter,
    isActive: activeFilter === undefined ? undefined : activeFilter === "true",
  };

  const updateStaffState = (updates: {
    role?: string;
    isActive?: boolean;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => {
    const params: Record<string, string | number | null | undefined> = {};

    if ("pageNumber" in updates) params.page = updates.pageNumber;
    if ("pageSize" in updates) params.size = updates.pageSize;
    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates)
      params.sortDirection =
        updates.sortDirection === "asc" ? null : updates.sortDirection;

    if ("role" in updates) {
      params.role = updates.role;
      params.page = 1;
    }
    if ("isActive" in updates) {
      params.active =
        updates.isActive === undefined ? null : String(updates.isActive);
      params.page = 1;
    }

    updateParams(params);
  };

  return {
    staffState,
    updateStaffState,
    roleFilter,
    activeFilter,
  };
}

// ── Invitations table state ───────────────────────────────────────────────────

export function useInvitationsTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const statusParam = searchParams.get("status") || undefined;
  const roleFilter = searchParams.get("invRole") || undefined;

  const statusFilter: InvitationStatus | undefined =
    statusParam !== undefined
      ? (Number(statusParam) as InvitationStatus)
      : undefined;

  const invitationsState: InvitationsSearchParams = {
    ...baseState,
    status: statusFilter,
    role: roleFilter,
  };

  const updateInvitationsState = (updates: {
    status?: string;
    invRole?: string;
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  }) => {
    const params: Record<string, string | number | null | undefined> = {};

    if ("pageNumber" in updates) params.page = updates.pageNumber;
    if ("pageSize" in updates) params.size = updates.pageSize;
    if ("sortBy" in updates) params.sortBy = updates.sortBy;
    if ("sortDirection" in updates)
      params.sortDirection =
        updates.sortDirection === "asc" ? null : updates.sortDirection;

    if ("status" in updates) {
      params.status = updates.status;
      params.page = 1;
    }
    if ("invRole" in updates) {
      params.invRole = updates.invRole;
      params.page = 1;
    }

    updateParams(params);
  };

  return {
    invitationsState,
    updateInvitationsState,
    statusParam,
    roleFilter,
  };
}
