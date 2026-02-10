/**
 * Location feature types
 * These match the GeoNames DTOs from backend
 */

/**
 * Bilingual name structure for Arabic and English
 */
export interface BilingualName {
  en: string;
  ar: string;
}

/**
 * Country DTO from GeoNames API (via backend proxy)
 */
export interface CountryDto {
  geonameId: number;
  countryCode: string; // ISO2 code (e.g., "EG", "SA")
  phoneCode: string; // Phone code (e.g., "+20")
  name: BilingualName; // Bilingual name
}

/**
 * State/City DTO from GeoNames API (via backend proxy)
 */
export interface StateDto {
  geonameId: number;
  name: BilingualName; // Bilingual name
  fcode: string; // Feature code (e.g., "ADM1" for states)
}

/**
 * City DTO from GeoNames API (via backend proxy)
 */
export interface CityDto {
  geonameId: number;
  name: BilingualName; // Bilingual name
  fcode: string; // Feature code (e.g., "PPL" for cities)
}
