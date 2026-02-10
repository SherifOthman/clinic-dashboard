// Core API types that were moved from @/lib/types/api

export interface UserDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  userName?: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  emailConfirmed: boolean;
  roles: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ClinicDto {
  id: string;
  name: string;
  subscriptionPlanId: string;
  subscriptionPlan?: SubscriptionPlanDto;
  subscriptionPlanName?: string;
  branches: ClinicBranchDto[];
  isActive: boolean;
  userCount: number;
  patientCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ClinicBranchDto {
  id: string;
  name: string;
  address: string;
  countryId: number;
  stateId: number;
  cityId: number;
  phoneNumbers: ClinicBranchPhoneNumberDto[];
  createdAt: string;
}

export interface ClinicBranchPhoneNumberDto {
  id: string;
  phoneNumber: string;
  label?: string;
}

export interface SubscriptionPlanDto {
  id: string;
  name: string;
  nameAr?: string;
  description: string;
  descriptionAr?: string;
  monthlyFee: number;
  yearlyFee: number;
  setupFee: number;
  maxBranches: number;
  maxStaff: number;
  hasAdvancedReporting: boolean;
  hasApiAccess: boolean;
  hasPrioritySupport: boolean;
  hasCustomBranding: boolean;
  isActive: boolean;
  isPopular?: boolean;
  displayOrder: number;
}

export interface CountryDto {
  id: number;
  name: string;
  phoneCode?: string;
}

export interface StateDto {
  id: number;
  name: string;
  countryId: number;
}

export interface CityDto {
  id: number;
  name: string;
  stateId: number;
  countryId: number;
}

export interface ChronicDiseaseDto {
  id: string;
  name: string;
  description?: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive: boolean;
}

export interface PatientDto {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  age: number;
  email?: string;
  phoneNumbers: PatientPhoneNumberDto[];
  dateOfBirth: string;
  gender: string;
  address?: string;
  chronicDiseases: ChronicDiseaseDto[];
  createdAt: string;
  updatedAt: string;
}

export interface PatientPhoneNumberDto {
  id: string;
  phoneNumber: string;
  label?: string;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  value?: T;
  message?: string;
  errors?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}
