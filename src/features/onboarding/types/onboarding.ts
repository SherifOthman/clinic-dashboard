export interface BranchPhoneNumberDto {
  phoneNumber: string;
  label?: string;
}

export interface LocationDataDto {
  countryGeonameId: number;
  countryIso2Code: string;
  countryPhoneCode: string;
  countryNameEn: string;
  countryNameAr: string;
  stateGeonameId: number;
  stateNameEn: string;
  stateNameAr: string;
  cityGeonameId: number;
  cityNameEn: string;
  cityNameAr: string;
}

export interface CompleteOnboardingDto {
  clinicName: string;
  subscriptionPlanId: string;
  branchName: string;
  branchAddress: string;
  location: LocationDataDto;
  branchPhoneNumbers: BranchPhoneNumberDto[];
}

export type CompleteOnboarding = CompleteOnboardingDto;
