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

/** Maps backend entity type names → human-readable display labels */
export const ENTITY_TYPE_LABELS: Record<string, string> = {
  Patient: "Patient",
  Staff: "Staff Member",
  StaffInvitation: "Staff Invitation",
  DoctorProfile: "Doctor Profile",
  DoctorSchedule: "Doctor Schedule",
  Clinic: "Clinic",
  ClinicBranch: "Branch",
  ClinicMember: "Clinic Member",
  ClinicSubscription: "Subscription",
  Appointment: "Appointment",
  Invoice: "Invoice",
  Auth: "Security Event",
  User: "User Account",
  VisitType: "Visit Type",
};

/** Entity type values used in the filter dropdown */
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

/** Maps raw backend field names → human-readable labels */
export const FIELD_LABELS: Record<string, string> = {
  // Identity / common
  FullName: "Full Name",
  FirstName: "First Name",
  LastName: "Last Name",
  Name: "Name",
  Email: "Email",
  PhoneNumber: "Phone",
  Role: "Role",
  IsActive: "Status",
  IsDeleted: "Deleted",

  // Patient
  PatientCode: "Patient Code",
  Gender: "Gender",
  DateOfBirth: "Date of Birth",
  BloodType: "Blood Type",
  NationalId: "National ID",
  Address: "Address",
  Notes: "Notes",

  // Location
  CityGeoNameId: "City",
  CountryGeoNameId: "Country",
  StateGeoNameId: "State",
  CityId: "City",
  CountryId: "Country",
  StateId: "State",

  // Staff / invitation
  InvitedEmail: "Invited Email",
  InvitedRole: "Invited Role",
  ExpiresAt: "Expires At",
  AcceptedAt: "Accepted At",
  CancelledAt: "Cancelled At",
  Status: "Status",

  // Doctor
  Specialization: "Specialization",
  Bio: "Bio",
  ConsultationFee: "Consultation Fee",
  YearsOfExperience: "Years of Experience",

  // Clinic / branch
  Description: "Description",
  LogoUrl: "Logo",
  Website: "Website",
  IsMainBranch: "Main Branch",
  Address1: "Address",
  OpeningTime: "Opening Time",
  ClosingTime: "Closing Time",

  // Appointment
  Date: "Date",
  QueueNumber: "Queue Number",
  ScheduledTime: "Scheduled Time",
  VisitDurationMinutes: "Duration (min)",
  AppointmentType: "Type",

  // Auth / tokens
  IsRevoked: "Token Revoked",
  ExpiryTime: "Token Expiry",
  EVENT: "Event",
  event: "Event",

  // Subscription
  StartDate: "Start Date",
  EndDate: "End Date",
  PlanName: "Plan",
};
