import { USER_ROLES } from "@/core/constants";

/** Shared chip color map for staff role badges. */
export const ROLE_COLORS: Record<
  string,
  "accent" | "success" | "warning" | "default"
> = {
  [USER_ROLES.DOCTOR]: "accent",
  [USER_ROLES.CLINIC_OWNER]: "success",
  [USER_ROLES.RECEPTIONIST]: "default",
};
