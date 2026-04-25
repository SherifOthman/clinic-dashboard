import { validatePhoneNumber } from "@/core/utils/phoneValidation";
import { createValidators } from "@/core/validators";
import { TFunction } from "i18next";
import { z } from "zod";

export const createPatientSchema = (t: TFunction) => {
  const v = createValidators(t);

  const nameField = z
    .string()
    .min(1, t("validation.required"))
    .max(100, t("validation.maxLength", { max: 100 }))
    .regex(
      /^[\u0600-\u06FFa-zA-Z\s'\-\.]+$/,
      t("validation.nameInvalidCharacters"),
    );

  return z.object({
    fullName: nameField,

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
    countryGeonameId: z.number().int().nullable().optional(),
    stateGeonameId: z.number().int().nullable().optional(),
    cityGeonameId: z.number().int().nullable().optional(),

    phoneNumbers: z
      .array(
        z
          .string()
          .refine((val) => val === "" || validatePhoneNumber(val) === true, {
            message: t("validation.phoneInvalid"),
          }),
      )
      .default([]),

    chronicDiseaseIds: v.optionalArray(z.uuid()),
  });
};

export type PatientFormData = z.infer<ReturnType<typeof createPatientSchema>>;
