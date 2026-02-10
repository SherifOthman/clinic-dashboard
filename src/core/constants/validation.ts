// Validation constants that match the backend ValidationConstants
// These should be kept in sync with the backend API

export interface ValidationConstants {
  names: {
    minLength: number;
    maxLength: number;
    pattern: string;
    patternDescription: string;
  };
  userName: {
    minLength: number;
    maxLength: number;
    pattern: string;
    patternDescription: string;
  };
  email: {
    maxLength: number;
  };
  password: {
    minLength: number;
    maxLength: number;
    complexityPattern: string;
    complexityDescription: string;
  };
  phoneNumber: {
    minLength: number;
    maxLength: number;
    minDigits: number;
    maxDigits: number;
  };
  patient: {
    fullName: {
      minLength: number;
      maxLength: number;
      pattern: string;
      patternDescription: string;
    };
    age: {
      minValue: number;
      maxValue: number;
    };
    address: {
      maxLength: number;
    };
  };
  file: {
    profileImage: {
      maxSizeBytes: number;
      allowedContentTypes: string[];
      allowedExtensions: string[];
    };
  };
  clinic: {
    name: {
      minLength: number;
      maxLength: number;
    };
    description: {
      maxLength: number;
    };
  };
  branch: {
    name: {
      minLength: number;
      maxLength: number;
    };
    address: {
      minLength: number;
      maxLength: number;
    };
  };
}

// Error code to user-friendly message mappings
export const ERROR_CODE_MESSAGES: Record<string, string> = {
  // Field validation errors
  "FIELD.FIRST_NAME.REQUIRED": "First name is required",
  "FIELD.FIRST_NAME.MIN_LENGTH": "First name is too short",
  "FIELD.FIRST_NAME.MAX_LENGTH": "First name is too long",
  "FIELD.FIRST_NAME.INVALID_CHARACTERS":
    "First name contains invalid characters",

  "FIELD.LAST_NAME.REQUIRED": "Last name is required",
  "FIELD.LAST_NAME.MIN_LENGTH": "Last name is too short",
  "FIELD.LAST_NAME.MAX_LENGTH": "Last name is too long",
  "FIELD.LAST_NAME.INVALID_CHARACTERS": "Last name contains invalid characters",

  "FIELD.USERNAME.REQUIRED": "Username is required",
  "FIELD.USERNAME.MIN_LENGTH": "Username is too short",
  "FIELD.USERNAME.MAX_LENGTH": "Username is too long",
  "FIELD.USERNAME.INVALID_CHARACTERS": "Username contains invalid characters",
  "FIELD.USERNAME.UNDERSCORE_POSITION":
    "Username cannot start or end with underscore",

  "FIELD.EMAIL.REQUIRED": "Email is required",
  "FIELD.EMAIL.INVALID_FORMAT": "Please enter a valid email address",
  "FIELD.EMAIL.MAX_LENGTH": "Email is too long",

  "FIELD.PASSWORD.REQUIRED": "Password is required",
  "FIELD.PASSWORD.MIN_LENGTH": "Password is too short",
  "FIELD.PASSWORD.MAX_LENGTH": "Password is too long",
  "FIELD.PASSWORD.COMPLEXITY":
    "Password must contain uppercase, lowercase, and number",
  "FIELD.PASSWORD.NO_SPACES": "Password cannot contain spaces",
  "FIELD.PASSWORD.DIFFERENT_REQUIRED":
    "New password must be different from current password",

  "FIELD.CONFIRM_PASSWORD.REQUIRED": "Please confirm your password",
  "FIELD.PASSWORDS.MUST_MATCH": "Passwords do not match",

  "FIELD.PHONE_NUMBER.REQUIRED": "Phone number is required",
  "FIELD.PHONE_NUMBER.INVALID": "Please enter a valid phone number",
  "FIELD.PHONE_NUMBER.MIN_LENGTH": "Phone number is too short",
  "FIELD.PHONE_NUMBER.MAX_LENGTH": "Phone number is too long",

  "FIELD.FULL_NAME.REQUIRED": "Full name is required",
  "FIELD.FULL_NAME.MIN_LENGTH": "Full name is too short",
  "FIELD.FULL_NAME.MAX_LENGTH": "Full name is too long",
  "FIELD.FULL_NAME.INVALID_CHARACTERS": "Full name contains invalid characters",

  "FIELD.DATE_OF_BIRTH.PAST": "Date of birth must be in the past",
  "FIELD.DATE_OF_BIRTH.TOO_OLD": "Date of birth is too old",

  "FIELD.GENDER.INVALID": "Please select a valid gender",

  "FIELD.PHONE_NUMBERS.REQUIRED": "At least one phone number is required",

  // File validation errors
  "FIELD.IMAGE.REQUIRED": "Image file is required",
  "FILE.TOO_LARGE": "File size is too large",
  "FILE.INVALID_TYPE": "Invalid file type",

  // Authentication errors
  "AUTH.CREDENTIALS.INVALID": "Invalid email or password",
  "AUTH.EMAIL.NOT_CONFIRMED": "Please confirm your email address",
  "AUTH.TOKEN.INVALID_RESET": "Invalid or expired reset token",

  // General validation
  "VALIDATION.POSITIVE_NUMBER_REQUIRED": "Value must be positive",

  // Default fallback
  "VALIDATION.GENERAL.ERROR": "Validation error occurred",
};

/**
 * Gets a user-friendly error message for an error code
 */
export function getErrorMessage(errorCode: string): string {
  return ERROR_CODE_MESSAGES[errorCode] || errorCode;
}

// Default constants (fallback if API is not available)
export const DEFAULT_VALIDATION_CONSTANTS: ValidationConstants = {
  names: {
    minLength: 2,
    maxLength: 50,
    pattern: "^[\\u0600-\\u06FFa-zA-Z\\s'-]+$",
    patternDescription:
      "Names can only contain letters, spaces, hyphens, and apostrophes",
  },
  userName: {
    minLength: 3,
    maxLength: 30,
    pattern: "^[a-zA-Z0-9_]+$",
    patternDescription:
      "Username can only contain letters, numbers, and underscores",
  },
  email: {
    maxLength: 254,
  },
  password: {
    minLength: 8,
    maxLength: 128,
    complexityPattern: "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)",
    complexityDescription:
      "Password must contain at least one lowercase letter, one uppercase letter, and one number",
  },
  phoneNumber: {
    minLength: 7,
    maxLength: 20,
    minDigits: 7,
    maxDigits: 15,
  },
  patient: {
    fullName: {
      minLength: 1,
      maxLength: 200,
      pattern: "^[\\u0600-\\u06FFa-zA-Z\\s'-]+$",
      patternDescription:
        "Full name can only contain letters, spaces, hyphens, and apostrophes",
    },
    age: {
      minValue: 0,
      maxValue: 150,
    },
    address: {
      maxLength: 500,
    },
  },
  file: {
    profileImage: {
      maxSizeBytes: 5 * 1024 * 1024, // 5MB
      allowedContentTypes: [
        "image/jpeg",
        "image/jpg",
        "image/png",
        "image/gif",
        "image/webp",
      ],
      allowedExtensions: [".jpg", ".jpeg", ".png", ".gif", ".webp"],
    },
  },
  clinic: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    description: {
      maxLength: 500,
    },
  },
  branch: {
    name: {
      minLength: 2,
      maxLength: 100,
    },
    address: {
      minLength: 5,
      maxLength: 500,
    },
  },
};

// Cached validation constants
let cachedConstants: ValidationConstants | null = null;

/**
 * Fetches validation constants from the API
 */
export async function fetchValidationConstants(): Promise<ValidationConstants> {
  if (cachedConstants) {
    return cachedConstants;
  }

  try {
    const response = await fetch("/api/validation/constants");
    if (response.ok) {
      cachedConstants = await response.json();
      return cachedConstants!;
    }
  } catch (error) {
    console.warn(
      "Failed to fetch validation constants from API, using defaults:",
      error,
    );
  }

  // Fallback to default constants
  cachedConstants = DEFAULT_VALIDATION_CONSTANTS;
  return DEFAULT_VALIDATION_CONSTANTS;
}

/**
 * Gets validation constants (uses cached version if available)
 */
export function getValidationConstants(): ValidationConstants {
  return cachedConstants ?? DEFAULT_VALIDATION_CONSTANTS;
}

/**
 * Validates a phone number according to the backend rules
 */
export function validatePhoneNumber(phoneNumber: string): boolean {
  if (!phoneNumber) return false;

  const constants = getValidationConstants();
  const cleanPhone = phoneNumber.replace(/[^\d+]/g, "");
  const digitCount = cleanPhone.replace(/\+/g, "").length;

  return (
    digitCount >= constants.phoneNumber.minDigits &&
    digitCount <= constants.phoneNumber.maxDigits &&
    phoneNumber.length >= constants.phoneNumber.minLength &&
    phoneNumber.length <= constants.phoneNumber.maxLength
  );
}

/**
 * Validates a password according to the backend rules
 */
export function validatePassword(password: string): {
  isValid: boolean;
  errors: string[];
} {
  const constants = getValidationConstants();
  const errors: string[] = [];

  if (password.length < constants.password.minLength) {
    errors.push(
      `Password must be at least ${constants.password.minLength} characters long`,
    );
  }

  if (password.length > constants.password.maxLength) {
    errors.push(
      `Password must not exceed ${constants.password.maxLength} characters`,
    );
  }

  const complexityRegex = new RegExp(constants.password.complexityPattern);
  if (!complexityRegex.test(password)) {
    errors.push(constants.password.complexityDescription);
  }

  if (password.includes(" ")) {
    errors.push("Password cannot contain spaces");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

/**
 * Validates a name (first name, last name) according to the backend rules
 */
export function validateName(name: string): {
  isValid: boolean;
  errors: string[];
} {
  const constants = getValidationConstants();
  const errors: string[] = [];

  if (!name || name.trim().length === 0) {
    errors.push("Name is required");
  } else {
    if (name.length < constants.names.minLength) {
      errors.push(
        `Name must be at least ${constants.names.minLength} characters long`,
      );
    }

    if (name.length > constants.names.maxLength) {
      errors.push(
        `Name must not exceed ${constants.names.maxLength} characters`,
      );
    }

    const nameRegex = new RegExp(constants.names.pattern);
    if (!nameRegex.test(name)) {
      errors.push(constants.names.patternDescription);
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
