import {
  useCities,
  useCountries,
  useStates,
} from "@/features/location/hooks/useLocationQueries";
import type {
  CityDto,
  CountryDto,
  StateDto,
} from "@/features/location/types/location";
import { useState } from "react";

export interface LocationData {
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

export function useLocationSelection(
  onLocationChange?: (location: LocationData) => void,
) {
  const [selectedCountry, setSelectedCountry] = useState<CountryDto | null>(
    null,
  );
  const [selectedState, setSelectedState] = useState<StateDto | null>(null);
  const [selectedCity, setSelectedCity] = useState<CityDto | null>(null);

  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(
    selectedCountry?.geonameId ?? null,
  );
  const { data: cities, isLoading: citiesLoading } = useCities(
    selectedState?.geonameId ?? null,
  );

  const handleCountryChange = (geonameId: number) => {
    const country = countries?.find((c) => c.geonameId === geonameId);
    setSelectedCountry(country || null);
    setSelectedState(null);
    setSelectedCity(null);
  };

  const handleStateChange = (geonameId: number) => {
    const state = states?.find((s) => s.geonameId === geonameId);
    setSelectedState(state || null);
    setSelectedCity(null);
  };

  const handleCityChange = (geonameId: number) => {
    const city = cities?.find((c) => c.geonameId === geonameId);
    setSelectedCity(city || null);

    // Build complete location data
    if (selectedCountry && selectedState && city) {
      const locationData: LocationData = {
        countryGeonameId: selectedCountry.geonameId,
        countryIso2Code: selectedCountry.countryCode,
        countryPhoneCode: selectedCountry.phoneCode,
        countryNameEn: selectedCountry.name.en,
        countryNameAr: selectedCountry.name.ar,
        stateGeonameId: selectedState.geonameId,
        stateNameEn: selectedState.name.en,
        stateNameAr: selectedState.name.ar,
        cityGeonameId: city.geonameId,
        cityNameEn: city.name.en,
        cityNameAr: city.name.ar,
      };
      onLocationChange?.(locationData);
    }
  };

  return {
    countries: countries || [],
    states: states || [],
    cities: cities || [],
    countriesLoading,
    statesLoading,
    citiesLoading,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  };
}
