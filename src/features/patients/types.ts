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

// ── Location filter types (used by patient list filter dropdowns) ─────────────

/** A country item in the patient filter. */
export interface FilterCountry {
  geonameId: number;
  name: string;
}

/**
 * A state item in the patient filter.
 * countryGeonameId links it to its parent country — used to show only
 * states that belong to the selected country.
 */
export interface FilterState {
  geonameId: number;
  name: string;
  countryGeonameId: number;
}

/**
 * A city item in the patient filter.
 * stateGeonameId links it to its parent state — used to show only
 * cities that belong to the selected state.
 */
export interface FilterCity {
  geonameId: number;
  name: string;
  stateGeonameId: number;
}

/**
 * Response from GET /api/patients/location-filter.
 * One call returns all three lists — the frontend filters them client-side
 * based on what country/state the user has selected.
 */
export interface PatientLocationFilter {
  countries: FilterCountry[];
  states: FilterState[];
  cities: FilterCity[];
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
