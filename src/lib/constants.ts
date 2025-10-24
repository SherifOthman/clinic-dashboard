// Color mappings for consistent UI
export const STATUS_COLORS = {
  active: "success",
  inactive: "danger",
  "on-leave": "warning",
  scheduled: "default",
  confirmed: "primary",
  "in-progress": "warning",
  completed: "success",
  cancelled: "danger",
} as const;

export const SUBSCRIPTION_COLORS = {
  basic: "default",
  premium: "primary",
  enterprise: "secondary",
} as const;

export const GENDER_COLORS = {
  male: "primary",
  female: "secondary",
  other: "default",
} as const;

export const APPOINTMENT_TYPE_COLORS = {
  consultation: "primary",
  "follow-up": "secondary",
  emergency: "danger",
  checkup: "success",
} as const;

// Default pagination settings
export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 10,
  PAGE_SIZE_OPTIONS: [5, 10, 20, 50],
} as const;

// Date formats
export const DATE_FORMATS = {
  DISPLAY: "MMM dd, yyyy",
  INPUT: "yyyy-MM-dd",
  DATETIME: "MMM dd, yyyy HH:mm",
} as const;

// Validation rules
export const VALIDATION = {
  EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE_REGEX: /^\+?[\d\s\-\(\)]+$/,
  MIN_PASSWORD_LENGTH: 8,
} as const;
