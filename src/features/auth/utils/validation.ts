import { VALIDATION_RULES } from "@/core/constants/app";
import { z } from "zod";

export const passwordSchema = z
  .string()
  .min(VALIDATION_RULES.password.minLength)
  .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
  .regex(/[a-z]/, "Password must contain at least one lowercase letter")
  .regex(/\d/, "Password must contain at least one number")
  .regex(
    /[^A-Za-z0-9]/,
    "Password must contain at least one special character",
  );

export const confirmEmailSchema = z.object({
  email: z.email(),
  token: z.string().min(1),
});

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

export function validatePassword(password: string): boolean {
  return passwordSchema.safeParse(password).success;
}
