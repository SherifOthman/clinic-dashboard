import { useBaseTableState } from "@/core/hooks/useTableState";
import type { InvitationsSearchParams, StaffSearchParams } from "./types";
import { InvitationStatus } from "./types";

// ── Staff list table state ────────────────────────────────────────────────────

export function useStaffTableState() {
  const { baseState, updateBaseState, searchParams, updateParam } =
    useBaseTableState();

  const roleFilter = searchParams.get("role") || undefined;
  const activeFilter = searchParams.get("active"); // "true" | "false" | null

  const staffState: StaffSearchParams = {
    ...baseState,
    role: roleFilter,
    isActive: activeFilter === null ? undefined : activeFilter === "true",
  };

  return {
    staffState,
    updateBaseState,
    updateParam,
    roleFilter,
    activeFilter,
  };
}

// ── Invitations table state ───────────────────────────────────────────────────

export function useInvitationsTableState() {
  const { baseState, updateBaseState, searchParams, updateParam } =
    useBaseTableState();

  const statusParam = searchParams.get("status");
  const roleFilter = searchParams.get("invRole") || undefined;

  const statusFilter: InvitationStatus | undefined =
    statusParam !== null
      ? (Number(statusParam) as InvitationStatus)
      : undefined;

  const invitationsState: InvitationsSearchParams = {
    ...baseState,
    status: statusFilter,
    role: roleFilter,
  };

  return {
    invitationsState,
    updateBaseState,
    updateParam,
    statusParam,
    roleFilter,
  };
}
