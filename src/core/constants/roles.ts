/**
 * User role constants
 * These must match the backend role names exactly
 */
export const USER_ROLES = {
  CLINIC_OWNER: "ClinicOwner",
  DOCTOR: "Doctor",
  RECEPTIONIST: "Receptionist",
  SUPER_ADMIN: "SuperAdmin",
} as const;

export type UserRole = (typeof USER_ROLES)[keyof typeof USER_ROLES];
