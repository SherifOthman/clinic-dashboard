// Common types used across the application
export interface ErrorItem {
  field: string;
  code: string;
  message: string;
}

export interface ApiError {
  type: string;
  code?: string;
  message: string;
  errors?: ErrorItem[];
}

export interface AuthResponse {
  accessToken: string;
  user: User;
}

export interface User {
  FirstName: string;
  SecondName?: string;
  ThirdName: string;
  Email: string;
  Avatar?: string;
  PhoneNumber?: string;
}

export interface BaseEntity {
  id: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Patient extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
  medicalNotes: string;
  lastVisit: string;
}

export interface Clinic extends BaseEntity {
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  subscription: "basic" | "premium" | "enterprise";
  patientCount: number;
  dailyAppointments: number;
}

export interface Appointment extends BaseEntity {
  patientId: string;
  patientName: string;
  doctorId: string;
  doctorName: string;
  clinicId: string;
  clinicName: string;
  receptionistId: string;
  type: "consultation" | "follow-up" | "emergency" | "checkup";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  date: string;
  time: string;
  duration: number;
  price: number;
  paidPrice: number;
  discount: number;
  notes: string;
  symptoms: string;
}

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: "admin" | "doctor" | "receptionist";
  avatar?: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter and search types
export interface FilterOptions {
  search?: string;
  status?: string;
  type?: string;
  dateFrom?: string;
  dateTo?: string;
}

export interface SortOptions {
  field: string;
  direction: "asc" | "desc";
}
