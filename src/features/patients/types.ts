import type { BaseSearchParams } from "@/core/types";

export interface PatientListItem {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  chronicDiseaseCount: number;
  primaryPhone?: string;
  createdAt: string;
  clinicName?: string;
  // IDs — kept for filtering
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
  // Resolved names — returned directly by the backend, no extra API calls needed
  countryName?: string;
  stateName?: string;
  cityName?: string;
}

export interface PatientDetail {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: string;
  bloodType?: string;
  phoneNumbers: string[];
  chronicDiseases: { id: string; nameEn: string; nameAr: string }[];
  // IDs — kept for the edit form (LocationSelector needs them)
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
  // Resolved names — ready to display
  countryName?: string;
  stateName?: string;
  cityName?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  clinicId?: string;
  clinicName?: string;
}

export interface ChronicDisease {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface PatientsSearchParams extends BaseSearchParams {
  gender?: "Male" | "Female";
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
  clinicSearch?: string;
}

/** Single request shape for both create and update. */
export interface PatientApiRequest {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
  bloodType?: string;
  phoneNumbers: string[];
  chronicDiseaseIds: string[];
}

/** Maps blood type strings to their chip color. */
export const BLOOD_TYPE_COLORS: Record<
  string,
  "danger" | "warning" | "accent" | "success" | "default"
> = {
  "O-": "danger",
  "O+": "warning",
  "A-": "accent",
  "A+": "accent",
  "B-": "success",
  "B+": "success",
  "AB-": "default",
  "AB+": "default",
};
