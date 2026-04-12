import { validatePhoneNumber } from "@/core/utils/phoneValidation";
import { createValidators } from "@/core/validators";
import { TFunction } from "i18next";
import { z } from "zod";

export const createPatientSchema = (t: TFunction) => {
  const v = createValidators(t);

  return z.object({
    fullName: z
      .string()
      .min(1, t("validation.required"))
      .max(200, t("validation.maxLength", { max: 200 }))
      .regex(
        /^[\u0600-\u06FFa-zA-Z\s'\-\.]+$/,
        t("validation.nameInvalidCharacters"),
      ),

    dateOfBirth: z
      .string()
      .min(1, t("validation.required"))
      .regex(/^\d{4}-\d{2}-\d{2}$/, t("validation.invalidDate"))
      .refine(
        (val) => new Date(val) <= new Date(),
        t("validation.dateNotFuture"),
      ),

    age: z
      .number({ message: t("validation.invalidNumber") })
      .min(0)
      .max(150)
      .optional(),

    gender: z.enum(["Male", "Female"], { message: t("validation.required") }),

    bloodType: z.string().optional(),
    cityNameEn: z.string().nullable().optional(),
    cityNameAr: z.string().nullable().optional(),
    stateNameEn: z.string().nullable().optional(),
    stateNameAr: z.string().nullable().optional(),
    countryNameEn: z.string().nullable().optional(),
    countryNameAr: z.string().nullable().optional(),

    // Phone numbers are optional — patients may not have a phone on file
    phoneNumbers: z
      .array(
        z
          .string()
          .min(1, t("validation.required"))
          .refine((val) => validatePhoneNumber(val) === true, {
            message: t("validation.phoneInvalid"),
          }),
      )
      .default([]),

    chronicDiseaseIds: v.optionalArray(z.uuid()),
  });
};

export type PatientFormData = z.infer<ReturnType<typeof createPatientSchema>>;
