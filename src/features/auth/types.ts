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
  hasPassword?: boolean;
  specializationNameEn?: string;
  specializationNameAr?: string;
  gender: string;
  staffId?: string;
  memberId?: string;
  appointmentType?: "Queue" | "Time";
  weekStartDay?: number; // 0 = Sunday … 6 = Saturday, default 6 (Saturday)
}

export interface LoginResponse {
  accessToken: string;
  refreshToken?: string;
}
