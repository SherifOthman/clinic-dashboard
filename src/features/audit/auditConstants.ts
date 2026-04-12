import type { AuditAction } from "./types";

export const ACTION_COLORS: Record<
  AuditAction,
  "success" | "warning" | "danger" | "accent" | "default"
> = {
  Create: "success",
  Update: "warning",
  Delete: "danger",
  Security: "accent",
  Restore: "default",
};

export const AUTH_EVENT_LABELS: Record<string, string> = {
  LoginSuccess: "Login",
  LoginFailed: "Failed login",
  LoginBlocked: "Login blocked",
  AccountLocked: "Account locked",
  Logout: "Logout",
  Register: "Registration",
};

export const ENTITY_TYPES = [
  "Patient",
  "Staff",
  "StaffInvitation",
  "DoctorProfile",
  "Clinic",
  "ClinicBranch",
  "Auth",
];

export const AUDIT_ACTIONS: AuditAction[] = [
  "Create",
  "Update",
  "Delete",
  "Security",
  "Restore",
];

export const FIELD_LABELS: Record<string, string> = {
  FullName: "Full Name",
  Gender: "Gender",
  DateOfBirth: "Date of Birth",
  BloodType: "Blood Type",
  PatientCode: "Patient Code",
  CityGeoNameId: "City",
  CountryGeoNameId: "Country",
  StateGeoNameId: "State",
  IsActive: "Status",
  IsRevoked: "Token Status",
  ExpiryTime: "Expiry",
  Name: "Name",
  Email: "Email",
  PhoneNumber: "Phone",
  Role: "Role",
  EVENT: "Event",
};
