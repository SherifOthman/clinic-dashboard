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
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
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
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
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
  stateGeonameId?: number;
  cityGeonameId?: number;
  countryGeonameId?: number;
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

/** A resolved GeoNames ID → name pair returned by the backend. */
export interface LocationNameItem {
  geonameId: number;
  name: string;
}

/**
 * Combined location filter data — one backend call returns all three lists
 * with names already resolved (server-side GeoNames + caching).
 */
export interface PatientLocationFilter {
  countries: LocationNameItem[];
  states: LocationNameItem[];
  cities: LocationNameItem[];
}

/** Maps blood type strings to their chip color. Used in table columns and detail dialog. */
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
