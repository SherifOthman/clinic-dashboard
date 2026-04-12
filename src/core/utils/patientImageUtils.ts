/**
 * Returns the age-appropriate patient avatar image path.
 *
 * Images live in /public/patients-images/ and follow the naming convention:
 *   {stage}-{male|female}.jpeg
 *
 * Age stages:
 *   newborn      → 0 – 4 months
 *   infant       → 4 – 7 months
 *   baby         → 7 – 12 months
 *   toddler      → 1 – 5 years
 *   child        → 5 – 15 years
 *   teen         → 15 – 25 years
 *   young-adult  → 25 – 35 years
 *   adult        → 35 – 40 years
 *   middle-aged  → 40 – 60 years
 *   senior       → 60+ years
 *
 * Falls back to the generic man/woman image when dateOfBirth is unknown.
 */
export function getPatientImageSrc(
  gender: string,
  dateOfBirth?: string | null,
): string {
  const suffix = gender === "Female" ? "female" : "male";

  if (!dateOfBirth)
    return `patients-images/${gender === "Female" ? "woman" : "man"}.jpeg`;

  const birth = new Date(dateOfBirth);
  const now = new Date();
  // Calculate total months elapsed since birth for fine-grained infant stages
  const totalMonths =
    (now.getFullYear() - birth.getFullYear()) * 12 +
    (now.getMonth() - birth.getMonth());

  let stage: string;

  if (totalMonths < 4) {
    stage = "newborn";
  } else if (totalMonths < 7) {
    stage = "infant";
  } else if (totalMonths < 12) {
    stage = "baby";
  } else {
    const years = Math.floor(totalMonths / 12);
    if (years < 5) {
      stage = "toddler";
    } else if (years < 15) {
      stage = "child";
    } else if (years < 25) {
      stage = "teen";
    } else if (years < 35) {
      stage = "young-adult";
    } else if (years < 40) {
      stage = "adult";
    } else if (years < 60) {
      stage = "middle-aged";
    } else {
      stage = "senior";
    }
  }

  return `patients-images/${stage}-${suffix}.jpeg`;
}

/**
 * Generic gender image — used for staff, users, and any entity
 * where we have gender but no date of birth.
 */
export function getGenderImageSrc(gender: string): string {
  return `patients-images/${gender === "Female" ? "woman" : "man"}.jpeg`;
}
