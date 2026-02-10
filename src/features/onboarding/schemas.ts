import { createPhoneNumberSchema } from "@/core/utils/phoneValidation";
import i18next from "i18next";
import { z } from "zod";

export const step1Schema = z.object({
  clinicName: z.string().min(1),
  subscriptionPlanId: z.string().min(1),
});

export type Step1FormData = z.infer<typeof step1Schema>;

export const locationDataSchema = z.object({
  countryGeonameId: z.number().min(1),
  countryIso2Code: z.string().min(1),
  countryPhoneCode: z.string().min(1),
  countryNameEn: z.string().min(1),
  countryNameAr: z.string().min(1),
  stateGeonameId: z.number().min(1),
  stateNameEn: z.string().min(1),
  stateNameAr: z.string().min(1),
  cityGeonameId: z.number().min(1),
  cityNameEn: z.string().min(1),
  cityNameAr: z.string().min(1),
});

export const step2Schema = z.object({
  branchName: z.string().min(1),
  branchAddress: z.string().min(1),
  branchPhoneNumbers: z
    .array(
      z.object({
        phoneNumber: createPhoneNumberSchema(i18next.t.bind(i18next)),
        label: z.string().optional(),
      }),
    )
    .min(1),
  location: locationDataSchema,
});

export type Step2FormData = z.infer<typeof step2Schema>;

// Combined schema for the entire onboarding form
export const onboardingSchema = step1Schema.extend(step2Schema.shape);

export type OnboardingFormData = z.infer<typeof onboardingSchema>;
