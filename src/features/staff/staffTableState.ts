import { useBaseTableState } from "@/core/hooks/useTableState";
import type { InvitationsSearchParams, StaffSearchParams } from "./types";
import { InvitationStatus } from "./types";

// ── Shared helper ─────────────────────────────────────────────────────────────

/**
 * Builds the base URL params object from common table updates (page, size, sort).
 * Feature-specific params are added by each hook after calling this.
 */
function buildBaseParams(
  updates: {
    pageNumber?: number;
    pageSize?: number;
    sortBy?: string;
    sortDirection?: "asc" | "desc";
  },
): Record<string, string | number | null | undefined> {
  const params: Record<string, string | number | null | undefined> = {};
  if ("pageNumber" in updates) params.page = updates.pageNumber;
  if ("pageSize" in updates) params.size = updates.pageSize;
  if ("sortBy" in updates) params.sortBy = updates.sortBy;
  if ("sortDirection" in updates)
    params.sortDirection = updates.sortDirection === "asc" ? null : updates.sortDirection;
  return params;
}

// ── Staff list table state ────────────────────────────────────────────────────

export function useStaffTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const roleFilter = searchParams.get("role") || undefined;
  const activeFilter = searchParams.get("active") || undefined;

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
    const params = buildBaseParams(updates);

    if ("role" in updates) { params.role = updates.role; params.page = 1; }
    if ("isActive" in updates) {
      params.active = updates.isActive === undefined ? null : String(updates.isActive);
      params.page = 1;
    }

    updateParams(params);
  };

  return { staffState, updateStaffState, roleFilter, activeFilter };
}

// ── Invitations table state ───────────────────────────────────────────────────

export function useInvitationsTableState() {
  const { baseState, searchParams, updateParams } = useBaseTableState();

  const statusParam = searchParams.get("status") || undefined;
  const roleFilter = searchParams.get("invRole") || undefined;

  const invitationsState: InvitationsSearchParams = {
    ...baseState,
    status: statusParam !== undefined ? (Number(statusParam) as InvitationStatus) : undefined,
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
    const params = buildBaseParams(updates);

    if ("status" in updates) { params.status = updates.status; params.page = 1; }
    if ("invRole" in updates) { params.invRole = updates.invRole; params.page = 1; }

    updateParams(params);
  };

  return { invitationsState, updateInvitationsState, statusParam, roleFilter };
}
