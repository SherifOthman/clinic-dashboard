import { Gender } from "@/core/types/common";

export type GenderString = "Male" | "Female";
export type GenderNumber = 0 | 1;

export function genderToString(
  gender: Gender | number | null | undefined,
): GenderString | null {
  if (gender === null || gender === undefined) return null;

  switch (gender) {
    case Gender.Female:
    case 0:
      return "Female";
    case Gender.Male:
    case 1:
      return "Male";
    default:
      return null;
  }
}

export function stringToGender(
  gender: string | null | undefined,
): Gender | null {
  if (!gender) return null;

  switch (gender.toLowerCase()) {
    case "female":
      return Gender.Female;
    case "male":
      return Gender.Male;
    default:
      return null;
  }
}

export function genderToNumber(
  gender: Gender | string | null | undefined,
): GenderNumber | null {
  if (gender === null || gender === undefined) return null;

  if (typeof gender === "string") {
    const genderEnum = stringToGender(gender);
    return genderEnum !== null ? (genderEnum as GenderNumber) : null;
  }

  if (gender === Gender.Female) return 0;
  if (gender === Gender.Male) return 1;
  if (gender === 0) return 0;
  if (gender === 1) return 1;

  return null;
}

export const GENDER_OPTIONS = [
  { value: "Male", label: "Male", enumValue: Gender.Male },
  { value: "Female", label: "Female", enumValue: Gender.Female },
] as const;

export function isValidGender(value: any): value is Gender {
  return value === Gender.Female || value === Gender.Male;
}

export function getGenderColor(
  gender: Gender | number | string | null | undefined,
): "primary" | "secondary" | "default" {
  const genderEnum =
    typeof gender === "string" ? stringToGender(gender) : gender;

  switch (genderEnum) {
    case Gender.Male:
    case 1:
      return "primary";
    case Gender.Female:
    case 0:
      return "secondary";
    default:
      return "default";
  }
}

export function getGenderDisplay(
  gender: Gender | number | string | null | undefined,
): string {
  const genderString =
    typeof gender === "string" ? gender : genderToString(gender as Gender);
  return genderString || "Not specified";
}
