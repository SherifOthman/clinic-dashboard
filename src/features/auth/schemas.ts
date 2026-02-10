import { createPhoneNumberSchema } from "@/core/utils/phoneValidation";
import i18next from "i18next";
import { z } from "zod";

// Login Schema - accepts email or username
export const createLoginSchema = () =>
  z.object({
    email: z.string().min(1, i18next.t("validation.required")),
    password: z.string().min(1, i18next.t("validation.required")),
  });

export const loginSchema = createLoginSchema();
export type LoginFormData = z.infer<typeof loginSchema>;

// Register Schema
export const createRegisterSchema = () =>
  z.object({
    firstName: z.string().min(1, i18next.t("validation.required")),
    lastName: z.string().min(1, i18next.t("validation.required")),
    userName: z.string().min(1, i18next.t("validation.required")),
    email: z
      .string()
      .min(1, i18next.t("validation.required"))
      .pipe(z.email(i18next.t("validation.string.email"))),
    password: z
      .string()
      .min(8, i18next.t("validation.string.minLength", { min: 8 }))
      .max(128, i18next.t("validation.string.maxLength", { max: 128 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        i18next.t("validation.password.complexity"),
      )
      .refine(
        (val) => !/\s/.test(val),
        i18next.t("validation.password.noSpaces"),
      ),
    phoneNumber: createPhoneNumberSchema(i18next.t.bind(i18next)),
  });

export const registerSchema = createRegisterSchema();
export type RegisterFormData = z.infer<typeof registerSchema>;

// Forgot Password Schema
export const createForgotPasswordSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, i18next.t("validation.required"))
      .pipe(z.email(i18next.t("validation.string.email"))),
  });

export const forgotPasswordSchema = createForgotPasswordSchema();
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

// Reset Password Schema
export const createResetPasswordSchema = () =>
  z.object({
    token: z.string().min(1, i18next.t("validation.required")),
    email: z
      .string()
      .min(1, i18next.t("validation.required"))
      .pipe(z.email(i18next.t("validation.string.email"))),
    newPassword: z
      .string()
      .min(8, i18next.t("validation.string.minLength", { min: 8 }))
      .max(128, i18next.t("validation.string.maxLength", { max: 128 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        i18next.t("validation.password.complexity"),
      )
      .refine(
        (val) => !/\s/.test(val),
        i18next.t("validation.password.noSpaces"),
      ),
  });

export const resetPasswordSchema = createResetPasswordSchema();
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

// Change Password Schema
export const createChangePasswordSchema = () =>
  z.object({
    currentPassword: z.string().min(1, i18next.t("validation.required")),
    newPassword: z
      .string()
      .min(8, i18next.t("validation.string.minLength", { min: 8 }))
      .max(128, i18next.t("validation.string.maxLength", { max: 128 }))
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        i18next.t("validation.password.complexity"),
      )
      .refine(
        (val) => !/\s/.test(val),
        i18next.t("validation.password.noSpaces"),
      ),
  });

export const changePasswordSchema = createChangePasswordSchema();
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;

// Resend Email Verification Schema
export const createResendEmailVerificationSchema = () =>
  z.object({
    email: z
      .string()
      .min(1, i18next.t("validation.required"))
      .pipe(z.email(i18next.t("validation.string.email"))),
  });

export const resendEmailVerificationSchema =
  createResendEmailVerificationSchema();
export type ResendEmailVerificationFormData = z.infer<
  typeof resendEmailVerificationSchema
>;
