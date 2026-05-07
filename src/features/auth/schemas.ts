import { createValidators } from "@/core/validators";
import type { TFunction } from "i18next";
import { z } from "zod";

/**
 * Auth schemas used in the dashboard.
 * Login, Register, ForgotPassword, ResetPassword, EmailVerification
 * are handled by the Next.js website — schemas for those live there.
 */
export const createAuthSchemas = (t: TFunction) => {
  const v = createValidators(t);

  return {
    changePassword: z.object({
      currentPassword: v.password(),
      newPassword: v.password(),
    }),

    updateProfile: z.object({
      fullName: v.name(),
      userName: v.username(),
      phoneNumber: v.phoneNumber(),
      gender: z.enum(["Male", "Female"], { message: t("validation.required") }),
    }),
  };
};

type AuthSchemas = ReturnType<typeof createAuthSchemas>;

export type ChangePassword = z.infer<AuthSchemas["changePassword"]>;
export type UpdateProfile  = z.infer<AuthSchemas["updateProfile"]>;
