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
  cityNameEn?: string;
  cityNameAr?: string;
  stateNameEn?: string;
  stateNameAr?: string;
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
  cityNameEn?: string;
  cityNameAr?: string;
  stateNameEn?: string;
  stateNameAr?: string;
  countryNameEn?: string;
  countryNameAr?: string;
  createdAt: string;
  updatedAt?: string;
  createdBy?: string;
  updatedBy?: string;
  clinicId?: string;
  clinicName?: string;
}

export interface PatientState {
  nameEn: string;
  nameAr: string;
}

export interface ChronicDisease {
  id: string;
  nameEn: string;
  nameAr: string;
}

export interface PatientsSearchParams extends BaseSearchParams {
  gender?: "Male" | "Female";
  stateSearch?: string;
  citySearch?: string;
  countrySearch?: string;
  clinicSearch?: string;
}

/** Single request shape for both create and update. */
export interface PatientApiRequest {
  fullName: string;
  dateOfBirth: string;
  gender: string;
  cityNameEn?: string;
  cityNameAr?: string;
  stateNameEn?: string;
  stateNameAr?: string;
  countryNameEn?: string;
  countryNameAr?: string;
  bloodType?: string;
  phoneNumbers: string[];
  chronicDiseaseIds: string[];
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
