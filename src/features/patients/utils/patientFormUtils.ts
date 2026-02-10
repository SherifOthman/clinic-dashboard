import { calculateAge } from "@/core/utils/ageUtils";
import { genderToString } from "@/core/utils/genderUtils";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";
import type { PatientDto } from "../types/patient";

export function getPatientFormDefaults(
  patient: PatientDto,
): UpdatePatientFormData {
  const formDefaults = {
    fullName: patient.fullName,
    dateOfBirth: patient.dateOfBirth || "",
    age:
      patient.age ||
      (patient.dateOfBirth ? calculateAge(patient.dateOfBirth) : undefined),
    gender: (genderToString(patient.gender) || "Male") as "Male" | "Female",
    cityGeoNameId: patient.cityGeoNameId,
    countryGeonameId: 0,
    stateGeonameId: 0,
    cityGeonameId: 0,
    phoneNumbers: patient.phoneNumbers.map((p) => ({
      id: p.id,
      phoneNumber: p.phoneNumber,
      isPrimary: p.isPrimary,
    })),
    chronicDiseaseIds: patient.chronicDiseases.map((cd) => cd.chronicDiseaseId),
  };

  return formDefaults;
}

export function getNewPatientDefaults(): CreatePatientFormData {
  return {
    fullName: "",
    dateOfBirth: "",
    age: undefined,
    gender: "Male",
    cityGeoNameId: undefined,
    countryGeonameId: 0,
    stateGeonameId: 0,
    cityGeonameId: 0,
    phoneNumbers: [{ phoneNumber: "", isPrimary: true }],
    chronicDiseaseIds: [],
  };
}

export function syncAgeAndDateOfBirth(
  field: "age" | "dateOfBirth",
  value: number | string,
  form: any,
) {
  if (field === "age" && typeof value === "number" && value > 0) {
    const today = new Date();
    const birthYear = today.getFullYear() - value;
    const approximateBirthDate = new Date(birthYear, 0, 1);
    form.setValue(
      "dateOfBirth",
      approximateBirthDate.toISOString().split("T")[0],
    );
  } else if (field === "dateOfBirth" && typeof value === "string" && value) {
    const age = calculateAge(value);
    form.setValue("age", age);
  }
}

export function validatePhoneNumbers(
  phoneNumbers: Array<{ phoneNumber: string }>,
): string[] {
  const errors: string[] = [];

  if (!phoneNumbers || phoneNumbers.length === 0) {
    errors.push("At least one phone number is required");
    return errors;
  }

  phoneNumbers.forEach((phone, index) => {
    if (!phone.phoneNumber || phone.phoneNumber.trim() === "") {
      errors.push(`Phone number ${index + 1} is required`);
    } else if (phone.phoneNumber.length < 5) {
      errors.push(`Phone number ${index + 1} is too short`);
    }
  });

  return errors;
}

export function isPatientDataComplete(
  data: CreatePatientFormData | UpdatePatientFormData,
): boolean {
  return !!(
    data.fullName &&
    data.phoneNumbers &&
    data.phoneNumbers.length > 0 &&
    data.phoneNumbers.every((p) => p.phoneNumber)
  );
}
