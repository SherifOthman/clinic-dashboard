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
  return {
    // ── String builders ──────────────────────────────────────────────────────

    requiredString: (max?: number) => {
      let s = z.string().min(1, t("validation.required"));
      return max ? s.max(max, t("validation.maxLength", { max })) : s;
    },

    optionalString: (max?: number) => {
      let s = z.string();
      return max ? s.max(max, t("validation.maxLength", { max })).optional() : s.optional();
    },

    // ── Number builders ──────────────────────────────────────────────────────

    requiredNumber: (min = 1, max?: number) => {
      let s = z.number({ message: t("validation.invalidNumber") }).min(min, t("validation.minValue", { min }));
      return max !== undefined ? s.max(max, t("validation.maxValue", { max })) : s;
    },

    optionalNumber: (min?: number, max?: number) => {
      let s = z.number({ message: t("validation.invalidNumber") });
      if (min !== undefined) s = s.min(min, t("validation.minValue", { min }));
      if (max !== undefined) s = s.max(max, t("validation.maxValue", { max }));
      return s.optional();
    },

    requiredArray: <T extends z.ZodTypeAny>(schema: T) =>
      z.array(schema).min(1, t("validation.required")),

    optionalArray: <T extends z.ZodTypeAny>(schema: T) =>
      z.array(schema).default([]),

    // ── Domain-specific validators ───────────────────────────────────────────

    email: () =>
      z.string()
        .min(1, t("validation.required"))
        .max(100, t("validation.maxLength", { max: 100 }))
        .pipe(z.email(t("validation.email"))),

    password: () =>
      z.string()
        .min(8, t("validation.minLength", { min: 8 }))
        .max(128, t("validation.maxLength", { max: 128 }))
        .regex(
          /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=\[\]{};':"\\|,.<>\/])/,
          t("validation.passwordComplexity"),
        ),

    username: () =>
      z.string()
        .min(3, t("validation.minLength", { min: 3 }))
        .max(50, t("validation.maxLength", { max: 50 }))
        .regex(/^[a-zA-Z0-9_]+$/, t("validation.usernameInvalidCharacters")),

    // Allows Arabic, English, spaces, apostrophe, hyphen, dot
    name: () =>
      z.string()
        .min(1, t("validation.required"))
        .max(50, t("validation.maxLength", { max: 50 }))
        .regex(/^[\u0600-\u06FFa-zA-Z\s'\-\.]+$/, t("validation.nameInvalidCharacters")),

    // Validated via libphonenumber-js (international format)
    phoneNumber: () =>
      z.string()
        .min(1, t("validation.required"))
        .refine((val) => validatePhoneNumber(val) === true, {
          message: t("validation.phoneInvalid"),
        }),

    requiredGuid: () =>
      z.string().min(1, t("validation.required")).uuid(t("validation.invalidId")),

    optionalGuid: () =>
      z.string().uuid(t("validation.invalidId")).optional(),
  };
};

export type Validators = ReturnType<typeof createValidators>;
