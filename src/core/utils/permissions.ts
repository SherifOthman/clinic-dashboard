import {
  PERMISSIONS,
  USER_ROLES,
  type Permission,
  type UserRole,
} from "@/core/constants";
import type { User } from "@/features/auth/types";

/**
 * Centralized permission checks.
 *
 * Prefer hasPermission() for fine-grained checks — permissions come from the
 * backend and are stored in the JWT. Role checks are kept for coarse-grained
 * access control (e.g. route guards) where a permission isn't needed.
 */

// ── Helpers ───────────────────────────────────────────────────────────────────

export function hasRole(
  user: User | null | undefined,
  role: UserRole,
): boolean {
  return !!user?.roles?.includes(role);
}

export function hasAnyRole(
  user: User | null | undefined,
  roles: UserRole[],
): boolean {
  return roles.some((r) => hasRole(user, r));
}

export function hasPermission(
  user: User | null | undefined,
  permission: Permission,
): boolean {
  return !!user?.permissions?.includes(permission);
}

export function hasAnyPermission(
  user: User | null | undefined,
  permissions: Permission[],
): boolean {
  return permissions.some((p) => hasPermission(user, p));
}

// ── Patient permissions ───────────────────────────────────────────────────────

export function canViewPatients(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_PATIENTS);
}

export function canCreatePatient(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.CREATE_PATIENT);
}

export function canEditPatient(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.EDIT_PATIENT);
}

export function canDeletePatient(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.DELETE_PATIENT);
}

// ── Staff permissions ─────────────────────────────────────────────────────────

export function canViewStaff(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_STAFF);
}

export function canInviteStaff(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.INVITE_STAFF);
}

export function canToggleStaffStatus(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_STAFF_STATUS);
}

// ── Branch permissions ────────────────────────────────────────────────────────

export function canViewBranches(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_BRANCHES);
}

export function canManageBranches(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_BRANCHES);
}

// ── Schedule permissions ──────────────────────────────────────────────────────

export function canManageSchedule(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_SCHEDULE);
}

export function canManageVisitTypes(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_VISIT_TYPES);
}

// ── Appointment permissions ───────────────────────────────────────────────────

export function canViewAppointments(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_APPOINTMENTS);
}

export function canManageAppointments(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_APPOINTMENTS);
}

// ── Invoice permissions ───────────────────────────────────────────────────────

export function canViewInvoices(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.VIEW_INVOICES);
}

export function canManageInvoices(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_INVOICES);
}

// ── Audit visibility (role-based — SuperAdmin only) ───────────────────────────

export function canViewAuditTrail(user: User | null | undefined): boolean {
  return hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLINIC_OWNER]);
}
