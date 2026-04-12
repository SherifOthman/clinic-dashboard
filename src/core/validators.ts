import { TFunction } from "i18next";
import { z } from "zod";
import { validatePhoneNumber } from "./utils/phoneValidation";

/**
 * Shared Zod validators used across multiple feature schemas.
 *
 * Why a factory function instead of plain constants?
 * Because error messages need to be translated, and `t()` is only
 * available inside React components/hooks. The factory is called
 * inside `useValidation(factory)` which provides the current `t`.
 *
 * Rule: if a validation is used in only one schema, define it inline
 * there. Only promote it here when two or more schemas need it.
 */
export const createValidators = (t: TFunction) => {
  // ── String builders ─────────────────────────────────────────────────────────

  const buildString = (max?: number, optional = false) => {
    let schema = z.string();
    if (!optional) schema = schema.min(1, t("validation.required"));
    if (max) schema = schema.max(max, t("validation.maxLength", { max }));
    return optional ? schema.optional() : schema;
  };

  const requiredString = (max?: number) => buildString(max, false);
  const optionalString = (max?: number) => buildString(max, true);

  // ── Number builders ─────────────────────────────────────────────────────────

  const buildNumber = (min?: number, max?: number, optional = false) => {
    let schema = z.number({ message: t("validation.invalidNumber") });
    if (min !== undefined)
      schema = schema.min(min, t("validation.minValue", { min }));
    if (max !== undefined)
      schema = schema.max(max, t("validation.maxValue", { max }));
    return optional ? schema.optional() : schema;
  };

  return {
    requiredString,
    optionalString,
    requiredNumber: (min: number = 1, max?: number) =>
      buildNumber(min, max, false),
    optionalNumber: (min?: number, max?: number) => buildNumber(min, max, true),

    requiredArray: <T extends z.ZodTypeAny>(schema: T) =>
      z.array(schema).min(1, t("validation.required")),
    optionalArray: <T extends z.ZodTypeAny>(schema: T) =>
      z.array(schema).default([]),

    // ── Domain-specific validators ───────────────────────────────────────────

    email: () =>
      z
        .string()
        .min(1, t("validation.required"))
        .max(100, t("validation.maxLength", { max: 100 }))
        .pipe(z.email(t("validation.email"))),

    password: () =>
      z
        .string()
        .min(8, t("validation.minLength", { min: 8 }))
        .max(128, t("validation.maxLength", { max: 128 }))
        // Must contain: lowercase, uppercase, digit, and a special character
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])/,
          t("validation.passwordComplexity"),
        ),

    username: () =>
      z
        .string()
        .min(3, t("validation.minLength", { min: 3 }))
        .max(50, t("validation.maxLength", { max: 50 }))
        .regex(/^[a-zA-Z0-9_]+$/, t("validation.usernameInvalidCharacters")),

    // First/last name — allows Arabic, English, spaces, apostrophe, hyphen, dot
    name: () =>
      z
        .string()
        .min(1, t("validation.required"))
        .max(50, t("validation.maxLength", { max: 50 }))
        .regex(
          /^[\u0600-\u06FFa-zA-Z\s'\-\.]+$/,
          t("validation.nameInvalidCharacters"),
        ),

    // Phone number validated via libphonenumber-js (international format)
    phoneNumber: () =>
      z
        .string()
        .min(1, t("validation.required"))
        .refine((val) => validatePhoneNumber(val) === true, {
          message: t("validation.phoneInvalid"),
        }),

    // GUID fields — used in onboarding + staff schemas
    requiredGuid: () =>
      z
        .string()
        .min(1, t("validation.required"))
        .uuid(t("validation.invalidId")),
    optionalGuid: () => z.string().uuid(t("validation.invalidId")).optional(),
  };
};

export type Validators = ReturnType<typeof createValidators>;
