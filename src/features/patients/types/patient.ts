/**
 * Patient feature types
 */

export interface PatientDto {
  id: string;
  patientCode: string;
  fullName: string;
  dateOfBirth: string;
  gender: number; // 0 = Female, 1 = Male (matches backend enum)
  age: number;
  cityGeoNameId?: number;
  phoneNumbers: PatientPhoneNumberDto[];
  chronicDiseases: PatientChronicDiseaseDto[];
  createdAt: string;
  updatedAt?: string;
}

export interface PatientPhoneNumberDto {
  id: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface PatientChronicDiseaseDto {
  id: string;
  patientId: string;
  chronicDiseaseId: string;
  chronicDisease: {
    id: string;
    name: string;
    nameEn: string;
    nameAr: string;
  };
  diagnosedDate: string;
  status?: string;
  notes?: string;
}

export interface CreatePatientDto {
  fullName: string;
  dateOfBirth: string;
  gender: number; // 0 = Female, 1 = Male
  cityGeoNameId?: number;
  phoneNumbers: CreatePatientPhoneNumberDto[];
  chronicDiseaseIds: string[];
}

export interface CreatePatientPhoneNumberDto {
  phoneNumber: string;
  isPrimary: boolean;
}

export interface UpdatePatientDto {
  fullName: string;
  dateOfBirth: string;
  gender: number; // 0 = Female, 1 = Male
  cityGeoNameId?: number;
  phoneNumbers: UpdatePatientPhoneNumberDto[];
  chronicDiseaseIds: string[];
}

export interface UpdatePatientPhoneNumberDto {
  id?: string;
  phoneNumber: string;
  isPrimary: boolean;
}

export interface PatientsSearchParams {
  searchTerm?: string;
  pageNumber?: number;
  pageSize?: number;
  sortBy?: string;
  sortDirection?: "asc" | "desc";
  gender?: number; // 0 = Female, 1 = Male
  dateOfBirthFrom?: string;
  dateOfBirthTo?: string;
  createdFrom?: string;
  createdTo?: string;
  minAge?: number;
  maxAge?: number;
}
