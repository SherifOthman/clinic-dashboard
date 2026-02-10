/**
 * Core shared types used across the application
 */

export interface BaseEntity {
  id: string;
  createdAt: string;
  updatedAt?: string;
}

export interface PaginationRequest {
  pageNumber: number;
  pageSize: number;
}

export interface SearchRequest extends PaginationRequest {
  searchTerm?: string;
  sortBy?: string;
  sortDescending?: boolean;
  [key: string]: any; // Allow additional filter properties
}

export interface PagedResult<T> {
  items: T[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface Result<T> {
  success: boolean;
  message?: string;
  value?: T;
  errors?: ErrorItem[];
}

export interface ErrorItem {
  field: string;
  code: string;
  message?: string; // Keep for backward compatibility
}

export interface ApiError {
  code: string;
  message?: string; // Keep for backward compatibility
  errors?: ErrorItem[];
}

// Common enums - Keep in sync with backend
export enum Gender {
  Female = 0,
  Male = 1,
}

export enum Role {
  ClinicOwner = 0,
  Doctor = 1,
  Receptionist = 2,
}
