import { USER_ROLES, type UserRole } from "@/core/constants/roles";
import type { User } from "@/features/auth/types";

/**
 * Check if user has a specific role
 */
export function hasRole(
  user: User | null | undefined,
  role: UserRole,
): boolean {
  if (!user?.roles) return false;
  return user.roles.includes(role);
}

/**
 * Check if user has any of the specified roles
 */
export function hasAnyRole(
  user: User | null | undefined,
  roles: UserRole[],
): boolean {
  if (!user?.roles) return false;
  return roles.some((role) => user.roles.includes(role));
}

/**
 * Check if user has all of the specified roles
 */
export function hasAllRoles(
  user: User | null | undefined,
  roles: UserRole[],
): boolean {
  if (!user?.roles) return false;
  return roles.every((role) => user.roles.includes(role));
}

/**
 * Check if user is a clinic owner
 */
export function isClinicOwner(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.CLINIC_OWNER);
}

/**
 * Check if user is a doctor
 */
export function isDoctor(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.DOCTOR);
}

/**
 * Check if user is a receptionist
 */
export function isReceptionist(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.RECEPTIONIST);
}

/**
 * Check if user is a super admin
 */
export function isSuperAdmin(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.SUPER_ADMIN);
}

/**
 * Check if user is staff (doctor or receptionist)
 */
export function isStaff(user: User | null | undefined): boolean {
  return hasAnyRole(user, [USER_ROLES.DOCTOR, USER_ROLES.RECEPTIONIST]);
}

/**
 * Get user's primary role (first role in the list)
 */
export function getPrimaryRole(user: User | null | undefined): UserRole | null {
  if (!user?.roles || user.roles.length === 0) return null;
  return user.roles[0] as UserRole;
}

/**
 * Get a display-friendly role name
 */
export function getRoleDisplayName(role: UserRole): string {
  const displayNames: Record<UserRole, string> = {
    [USER_ROLES.CLINIC_OWNER]: "Clinic Owner",
    [USER_ROLES.DOCTOR]: "Doctor",
    [USER_ROLES.RECEPTIONIST]: "Receptionist",
    [USER_ROLES.SUPER_ADMIN]: "Super Admin",
  };
  return displayNames[role] || role;
}
