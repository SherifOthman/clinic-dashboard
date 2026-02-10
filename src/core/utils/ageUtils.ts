export interface DetailedAge {
  years: number;
  months: number;
  days: number;
}

export function calculateAge(dateOfBirth: string | Date): number {
  if (!dateOfBirth) return 0;

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();

  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return Math.max(0, age);
}

export function calculateDetailedAge(dateOfBirth: string | Date): DetailedAge {
  if (!dateOfBirth) {
    return { years: 0, months: 0, days: 0 };
  }

  const today = new Date();
  const birthDate = new Date(dateOfBirth);

  let years = today.getFullYear() - birthDate.getFullYear();
  let months = today.getMonth() - birthDate.getMonth();
  let days = today.getDate() - birthDate.getDate();

  if (days < 0) {
    months--;
    const lastMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += lastMonth.getDate();
  }

  if (months < 0) {
    years--;
    months += 12;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
  };
}

export function formatDetailedAge(detailedAge: DetailedAge): string {
  const { years, months, days } = detailedAge;

  if (years === 0 && months === 0 && days === 0) {
    return "Newborn";
  }

  const parts: string[] = [];

  if (years > 0) {
    parts.push(`${years} year${years !== 1 ? "s" : ""}`);
  }

  if (months > 0) {
    parts.push(`${months} month${months !== 1 ? "s" : ""}`);
  }

  if (days > 0 && years === 0) {
    parts.push(`${days} day${days !== 1 ? "s" : ""}`);
  }

  return parts.join(", ");
}

export function calculateDateOfBirthFromAge(age: number): string {
  if (!age || age <= 0) return "";

  const today = new Date();
  const birthYear = today.getFullYear() - age;
  const birthDate = new Date(birthYear, today.getMonth(), today.getDate());

  return birthDate.toISOString().split("T")[0];
}

export function isValidAge(age: number): boolean {
  return age >= 0 && age <= 150;
}

export function getAgeCategory(age: number): string {
  if (age < 1) return "Infant";
  if (age < 13) return "Child";
  if (age < 20) return "Teenager";
  if (age < 65) return "Adult";
  return "Senior";
}
