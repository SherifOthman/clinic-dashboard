import { createValidators } from "@/core/validators";
import type { TFunction } from "i18next";
import { z } from "zod";

export const createStaffSchemas = (t: TFunction) => {
  const v = createValidators(t);

  return {
    inviteStaff: z
      .object({
        role: z.enum(["Doctor", "Receptionist"], {
          message: t("validation.required"),
        }),
        email: v.email(),
        specializationId: z.string().optional(),
      })
      .superRefine((data, ctx) => {
        if (data.role === "Doctor" && !data.specializationId) {
          ctx.addIssue({
            code: "custom",
            message: t("validation.required"),
            path: ["specializationId"],
          });
        }
      }),

    acceptInvitation: z.object({
      fullName: v.name(),
      userName: v.username(),
      password: v.password(),
      phoneNumber: v.phoneNumber(),
      gender: z.enum(["Male", "Female"], { message: t("validation.required") }),
    }),

    setOwnerAsDoctor: z.object({
      specializationId: z.string().optional(),
    }),
  };
};

type StaffSchemas = ReturnType<typeof createStaffSchemas>;
export type InviteStaffForm = z.infer<StaffSchemas["inviteStaff"]>;
export type AcceptInvitationForm = z.infer<StaffSchemas["acceptInvitation"]>;
export type SetOwnerAsDoctorForm = z.infer<StaffSchemas["setOwnerAsDoctor"]>;
