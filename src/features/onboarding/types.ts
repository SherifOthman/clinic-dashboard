export interface SubscriptionPlan {
  id: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  // Pricing
  monthlyFee: number;
  yearlyFee: number;
  setupFee: number;
  // Limits
  maxBranches: number;
  maxStaff: number;
  maxPatientsPerMonth: number;
  maxAppointmentsPerMonth: number;
  maxInvoicesPerMonth: number;
  storageLimitGB: number;
  // Features
  hasInventoryManagement: boolean;
  hasReporting: boolean;
  hasAdvancedReporting: boolean;
  hasApiAccess: boolean;
  hasMultipleBranches: boolean;
  hasCustomBranding: boolean;
  hasPrioritySupport: boolean;
  hasBackupAndRestore: boolean;
  hasIntegrations: boolean;
  // Status
  isActive: boolean;
  isPopular: boolean;
  displayOrder: number;
  // Versioning
  version: number;
  effectiveDate: string;
  expiryDate?: string;
}

export interface Specialization {
  id: string;
  nameEn: string;
  nameAr: string;
  descriptionEn?: string;
  descriptionAr?: string;
  isActive: boolean;
}
