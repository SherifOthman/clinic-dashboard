/**
 * Application-wide constants
 */

export const APP_CONFIG = {
  name: "ClinicManagement",
  version: "1.0.0",
  description: "Modern clinic management system",
} as const;

export const PAGINATION_DEFAULTS = {
  pageSize: 10,
  pageSizeOptions: [5, 10, 20, 50],
} as const;

export const API_ENDPOINTS = {
  auth: "/auth",
  admin: "/admin",
  onboarding: "/onboarding",
  locations: "/locations",
  subscriptionPlans: "/subscription-plans",
  specializations: "/specializations",
  userAnalytics: "/useranalytics",
  chronicDiseases: "/chronic-diseases",
  files: "/files",
  patients: "/patients",
  staff: "/staff",
  audit: "/audit",
  dashboard: "/dashboard",
  branches: "/branches",
} as const;

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

/**
 * Permission constants — must match backend Permission enum exactly
 */
export const PERMISSIONS = {
  // Patients
  VIEW_PATIENTS: "ViewPatients",
  CREATE_PATIENT: "CreatePatient",
  EDIT_PATIENT: "EditPatient",
  DELETE_PATIENT: "DeletePatient",
  // Staff
  VIEW_STAFF: "ViewStaff",
  INVITE_STAFF: "InviteStaff",
  MANAGE_STAFF_STATUS: "ManageStaffStatus",
  // Branches
  VIEW_BRANCHES: "ViewBranches",
  MANAGE_BRANCHES: "ManageBranches",
  // Schedule & Visit Types
  MANAGE_SCHEDULE: "ManageSchedule",
  MANAGE_VISIT_TYPES: "ManageVisitTypes",
  // Appointments
  VIEW_APPOINTMENTS: "ViewAppointments",
  MANAGE_APPOINTMENTS: "ManageAppointments",
  // Invoices
  VIEW_INVOICES: "ViewInvoices",
  MANAGE_INVOICES: "ManageInvoices",
} as const;

export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];

/**
 * Route access configuration
 * Defines which roles can access which routes
 */
export const ROUTE_ACCESS: Record<string, UserRole[] | "*"> = {
  "/dashboard": "*", // All authenticated users
  "/patients": [
    USER_ROLES.CLINIC_OWNER,
    USER_ROLES.DOCTOR,
    USER_ROLES.RECEPTIONIST,
    USER_ROLES.SUPER_ADMIN,
  ],
  "/staff": [USER_ROLES.CLINIC_OWNER],
  "/invitations": [USER_ROLES.CLINIC_OWNER],
  "/branches": [USER_ROLES.CLINIC_OWNER],
  "/audit": [USER_ROLES.SUPER_ADMIN],
  "/profile": "*", // All authenticated users
  "/onboarding": [USER_ROLES.CLINIC_OWNER],
} as const;
