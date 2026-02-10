import { createPhoneNumberSchema } from "@/core/utils/phoneValidation";
import i18next from "i18next";
import { z } from "zod";

export const createPatientPhoneNumberSchema = z.object({
  phoneNumber: createPhoneNumberSchema(i18next.t.bind(i18next)),
  isPrimary: z.boolean().default(false),
});

export const createPatientSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  age: z.number().min(0).max(150).optional(),
  gender: z.enum(["Male", "Female"]),
  cityGeoNameId: z.number().optional(),
  countryGeonameId: z.number().optional(),
  stateGeonameId: z.number().optional(),
  cityGeonameId: z.number().optional(),
  phoneNumbers: z.array(createPatientPhoneNumberSchema).min(1),
  chronicDiseaseIds: z.array(z.string()).default([]),
});

export const updatePatientPhoneNumberSchema = z.object({
  id: z.string().optional(),
  phoneNumber: createPhoneNumberSchema(i18next.t.bind(i18next)),
  isPrimary: z.boolean().default(false),
});

export const updatePatientSchema = z.object({
  fullName: z.string().min(1),
  dateOfBirth: z.string().min(1),
  age: z.number().min(0).max(150).optional(),
  gender: z.enum(["Male", "Female"]),
  cityGeoNameId: z.number().optional(),
  countryGeonameId: z.number().optional(),
  stateGeonameId: z.number().optional(),
  cityGeonameId: z.number().optional(),
  phoneNumbers: z.array(updatePatientPhoneNumberSchema).min(1),
  chronicDiseaseIds: z.array(z.string()).default([]),
});

export type CreatePatientFormData = z.infer<typeof createPatientSchema>;
export type UpdatePatientFormData = z.infer<typeof updatePatientSchema>;
