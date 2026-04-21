import {
  PERMISSIONS,
  ROUTE_ACCESS,
  USER_ROLES,
  type Permission,
  type UserRole,
} from "@/core/constants";
import type { User } from "@/features/auth/types";

/**
 * Centralized permission and role checks.
 *
 * Use hasPermission() for fine-grained feature access — permissions come from
 * the backend and are stored in the JWT.
 * Use hasRole() / isClinicOwner() etc. only for coarse-grained structural
 * checks (e.g. route guards, showing owner-only UI sections).
 */

// ── Role helpers ──────────────────────────────────────────────────────────────

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

export function isClinicOwner(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.CLINIC_OWNER);
}

export function isDoctor(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.DOCTOR);
}

export function isReceptionist(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.RECEPTIONIST);
}

export function isSuperAdmin(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.SUPER_ADMIN);
}

// ── Permission helpers ────────────────────────────────────────────────────────

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

export function canManageBranches(user: User | null | undefined): boolean {
  return hasPermission(user, PERMISSIONS.MANAGE_BRANCHES);
}

// ── Route access (role-based — used by route guards and sidebar) ──────────────

export function canAccessRoute(
  user: User | null | undefined,
  route: string,
): boolean {
  if (!user) return false;
  const allowed = ROUTE_ACCESS[route];
  if (allowed === "*") return true;
  if (!allowed) return false;
  return hasAnyRole(user, allowed as UserRole[]);
}

/**
 * Full route access check: role gate AND permission gate.
 * Used by the sidebar and RequireRole to hide/block routes the user
 * has no role or no permission for.
 */
export function canAccessRouteWithPermissions(
  user: User | null | undefined,
  route: string,
  requiredPermission: Permission | null,
): boolean {
  if (!canAccessRoute(user, route)) return false;
  if (requiredPermission === null) return true;
  return hasPermission(user, requiredPermission);
}

// ── Audit visibility (role-based — SuperAdmin or ClinicOwner only) ────────────

export function canViewAuditTrail(user: User | null | undefined): boolean {
  return hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLINIC_OWNER]);
}
