import { USER_ROLES, type UserRole } from "@/core/constants";
import type { User } from "@/features/auth/types";

/**
 * Centralized permission checks for the clinic management system.
 *
 * Roles and their responsibilities:
 *  - SuperAdmin   : system-level, manages all clinics on the platform
 *  - ClinicOwner  : manages their own clinic (staff, settings, billing)
 *  - Doctor       : clinical work (patients, visits, prescriptions)
 *  - Receptionist : front-desk operations (patients, appointments, invoices)
 *
 * Why functions instead of inline role checks?
 * Centralizing permission logic here means:
 *   - One place to update when business rules change
 *   - Readable names (canEditPatient) instead of scattered role comparisons
 *   - Easy to test in isolation
 */

function hasRole(user: User | null | undefined, role: UserRole): boolean {
  return !!user?.roles?.includes(role);
}

function hasAnyRole(user: User | null | undefined, roles: UserRole[]): boolean {
  return roles.some((r) => hasRole(user, r));
}

// ─── Patient permissions ────────────────────────────────────────────────────

/** Receptionist and Owner can edit patient registration data */
export function canEditPatient(user: User | null | undefined): boolean {
  return hasAnyRole(user, [USER_ROLES.CLINIC_OWNER, USER_ROLES.RECEPTIONIST]);
}

/** Only Owner can delete patients */
export function canDeletePatient(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.CLINIC_OWNER);
}

// ─── Staff permissions ──────────────────────────────────────────────────────

/** Only clinic owner can activate/deactivate staff */
export function canToggleStaffStatus(user: User | null | undefined): boolean {
  return hasRole(user, USER_ROLES.CLINIC_OWNER);
}

// ─── Audit visibility ───────────────────────────────────────────────────────

/**
 * Show audit trail (createdBy/updatedBy) only to Owner and SuperAdmin.
 * Doctors and Receptionists only see createdAt — not who made the change.
 */
export function canViewAuditTrail(user: User | null | undefined): boolean {
  return hasAnyRole(user, [USER_ROLES.SUPER_ADMIN, USER_ROLES.CLINIC_OWNER]);
}
