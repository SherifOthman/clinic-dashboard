import { createValidators } from "@/core/validators";
import { TFunction } from "i18next";
import { z } from "zod";

/**
 * All Zod schemas for the auth feature, created as a factory so error
 * messages are translated via the current `t()` function.
 *
 * Used with: const schemas = useValidation(createAuthSchemas);
 *
 * Types are inferred directly from the schemas so they stay in sync
 * automatically — no manual type duplication.
 */
export const createAuthSchemas = (t: TFunction) => {
  const v = createValidators(t);

  return {
    login: z.object({
      emailOrUsername: v.requiredString(),
      password: v.requiredString(),
    }),

    register: z.object({
      firstName: v.name(),
      lastName: v.name(),
      userName: v.username(),
      email: v.email(),
      password: v.password(),
      phoneNumber: v.phoneNumber(),
      gender: z.enum(["Male", "Female"], { message: t("validation.required") }),
    }),

    forgotPassword: z.object({
      email: v.email(),
    }),

    resetPassword: z.object({
      token: v.requiredString(),
      email: v.email(),
      newPassword: v.password(),
    }),

    changePassword: z.object({
      currentPassword: v.password(),
      newPassword: v.password(),
    }),

    updateProfile: z.object({
      firstName: v.name(),
      lastName: v.name(),
      userName: v.username(),
      phoneNumber: v.phoneNumber(),
      gender: z.enum(["Male", "Female"], { message: t("validation.required") }),
    }),

    confirmEmail: z.object({
      token: v.requiredString(),
      email: v.email(),
    }),

    resendEmailVerification: z.object({
      email: v.email(),
    }),
  };
};

type AuthSchemas = ReturnType<typeof createAuthSchemas>;

export type Login = z.infer<AuthSchemas["login"]>;
export type Register = z.infer<AuthSchemas["register"]>;
export type ForgotPassword = z.infer<AuthSchemas["forgotPassword"]>;
export type ResetPassword = z.infer<AuthSchemas["resetPassword"]>;
export type ChangePassword = z.infer<AuthSchemas["changePassword"]>;
export type UpdateProfile = z.infer<AuthSchemas["updateProfile"]>;
export type ConfirmEmail = z.infer<AuthSchemas["confirmEmail"]>;
export type ResendEmailVerification = z.infer<
  AuthSchemas["resendEmailVerification"]
>;
