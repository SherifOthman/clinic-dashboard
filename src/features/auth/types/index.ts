// Auth types
export interface User {
  id: string;
  userName: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  profileImageUrl?: string;
  profileImageUpdatedAt?: string;
  roles: string[];
  emailConfirmed: boolean;
  isActive: boolean;
  onboardingCompleted?: boolean;
  clinicName?: string;
  createdAt: string;
  updatedAt: string;
}

export interface LoginDto {
  email: string;
  password: string;
}

export interface RegisterDto {
  firstName: string;
  lastName: string;
  userName: string;
  email: string;
  password: string;
  phoneNumber: string;
}

export interface ForgotPasswordDto {
  email: string;
}

export interface ResetPasswordDto {
  token: string;
  email: string;
  newPassword: string;
}

export interface ChangePasswordDto {
  currentPassword: string;
  newPassword: string;
}

export interface ResendEmailVerificationDto {
  email: string;
}

export interface ConfirmEmailDto {
  token: string;
  email: string;
}
