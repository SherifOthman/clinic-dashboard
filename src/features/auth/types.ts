export interface Availability {
  isAvailable: boolean;
  message: string;
}

export interface User {
  userName: string;
  fullName: string;
  email: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  roles: string[];
  permissions: string[];
  emailConfirmed: boolean;
  onboardingCompleted?: boolean;
  specializationNameEn?: string;
  specializationNameAr?: string;
  gender: string;
  staffId?: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}
