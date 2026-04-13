import { createValidators } from "@/core/validators";
import { TFunction } from "i18next";
import { z } from "zod";

export const createOnboardingSchemas = (t: TFunction) => {
  const v = createValidators(t);

  const completeOnboarding = z
    .object({
      clinicName: v.requiredString(200),
      subscriptionPlanId: v.requiredGuid(),
      branchName: v.requiredString(200),
      addressLine: v.requiredString(500),
      cityNameEn: z.string().nullable().optional(),
      cityNameAr: z.string().nullable().optional(),
      stateNameEn: z.string().nullable().optional(),
      stateNameAr: z.string().nullable().optional(),
      countryCode: z.string().length(2).nullable().optional(),
      provideMedicalServices: z.enum(["yes", "no"]),
      specializationId: z.uuid().optional(),
    })
    .refine(
      (data) =>
        data.provideMedicalServices !== "yes" || !!data.specializationId,
      { message: t("validation.required"), path: ["specializationId"] },
    );

  return { completeOnboarding };
};

export type CompleteOnboarding = z.infer<
  ReturnType<typeof createOnboardingSchemas>["completeOnboarding"]
>;
