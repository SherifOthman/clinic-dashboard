import { ROUTE_ACCESS, USER_ROLES, type UserRole } from "@/core/constants";
import type { User } from "@/features/auth/types";

function hasRole(user: User | null | undefined, role: UserRole): boolean {
  return !!user?.roles?.includes(role);
}

function hasAnyRole(user: User | null | undefined, roles: UserRole[]): boolean {
  return roles.some((role) => hasRole(user, role));
}

export function canAccessRoute(
  user: User | null | undefined,
  route: string,
): boolean {
  if (!user) return false;
  const allowed = ROUTE_ACCESS[route];
  if (allowed === "*") return true;
  if (!allowed) return false;
  return hasAnyRole(user, allowed);
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
