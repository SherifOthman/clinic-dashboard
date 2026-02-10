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

export const VALIDATION_RULES = {
  password: {
    minLength: 8,
    requireUppercase: true,
    requireLowercase: true,
    requireNumbers: true,
    requireSpecialChars: true,
  },
  email: {
    maxLength: 254,
  },
  name: {
    minLength: 2,
    maxLength: 50,
  },
} as const;

export const API_ENDPOINTS = {
  auth: "/auth",
  admin: "/admin",
  onboarding: "/onboarding",
  locations: "/locations",
  subscriptionPlans: "/subscription-plans",
  userAnalytics: "/useranalytics",
  chronicDiseases: "/chronic-diseases",
  files: "/files",
} as const;
