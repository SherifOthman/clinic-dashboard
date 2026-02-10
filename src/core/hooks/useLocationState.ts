import {
  useCities,
  useCountries,
  useStates,
} from "@/features/location/hooks/useLocationQueries";
import { useEffect, useState } from "react";
import type { FieldPath, FieldValues, UseFormReturn } from "react-hook-form";
import { useLocalStorage } from "./useLocalStorage";

interface UseLocationStateOptions<T extends FieldValues> {
  form: UseFormReturn<T>;
  countryFieldName?: FieldPath<T>;
  stateFieldName?: FieldPath<T>;
  cityFieldName?: FieldPath<T>;
  saveToLocalStorage?: boolean;
  localStorageKey?: string;
}

interface LocationPreferences {
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
}

export function useLocationState<T extends FieldValues>({
  form,
  countryFieldName = "countryGeonameId" as FieldPath<T>,
  stateFieldName = "stateGeonameId" as FieldPath<T>,
  cityFieldName = "cityGeonameId" as FieldPath<T>,
  saveToLocalStorage = false,
  localStorageKey = "location-preferences",
}: UseLocationStateOptions<T>) {
  const [selectedCountry, setSelectedCountry] = useState<number | null>(null);
  const [selectedState, setSelectedState] = useState<number | null>(null);

  // Local storage for location preferences
  const [locationPreferences, setLocationPreferences] =
    useLocalStorage<LocationPreferences>(localStorageKey, {});

  // Watch form fields
  const watchedCountryGeonameId = form.watch(countryFieldName);
  const watchedStateGeonameId = form.watch(stateFieldName);
  const watchedCityGeonameId = form.watch(cityFieldName);

  // Location data hooks
  const { data: countries, isLoading: countriesLoading } = useCountries();
  const { data: states, isLoading: statesLoading } = useStates(
    watchedCountryGeonameId && watchedCountryGeonameId > 0
      ? watchedCountryGeonameId
      : null,
  );
  const { data: cities, isLoading: citiesLoading } = useCities(
    watchedStateGeonameId && watchedStateGeonameId > 0
      ? watchedStateGeonameId
      : null,
  );

  // Load saved preferences on mount or when editing with existing location
  useEffect(() => {
    if (saveToLocalStorage && countries?.length) {
      const currentCountryGeonameId = form.getValues(countryFieldName);
      const currentStateGeonameId = form.getValues(stateFieldName);

      // Set saved preferences if form fields have saved values but internal state doesn't
      if (
        currentCountryGeonameId &&
        currentCountryGeonameId > 0 &&
        !selectedCountry
      ) {
        setSelectedCountry(currentCountryGeonameId);
      }
      if (
        currentStateGeonameId &&
        currentStateGeonameId > 0 &&
        !selectedState
      ) {
        setSelectedState(currentStateGeonameId);
      }
    }
  }, [countries?.length, saveToLocalStorage, selectedCountry, selectedState]);

  // Country change effect
  useEffect(() => {
    if (watchedCountryGeonameId !== selectedCountry) {
      setSelectedCountry(watchedCountryGeonameId || null);
      if (watchedCountryGeonameId !== selectedCountry) {
        setSelectedState(null);
        form.setValue(stateFieldName, 0 as any);
        form.setValue(cityFieldName, 0 as any);
      }
    }
  }, [watchedCountryGeonameId, selectedCountry]);

  // State change effect
  useEffect(() => {
    if (watchedStateGeonameId !== selectedState) {
      setSelectedState(watchedStateGeonameId || null);
      if (watchedStateGeonameId !== selectedState) {
        form.setValue(cityFieldName, 0 as any);
      }
    }
  }, [watchedStateGeonameId, selectedState]);

  // Change handlers
  const handleCountryChange = (countryGeonameIdStr: string) => {
    const geonameId = parseInt(countryGeonameIdStr);
    setSelectedCountry(geonameId);
    setSelectedState(null);
    form.setValue(countryFieldName, geonameId as any);
    form.setValue(stateFieldName, 0 as any);
    form.setValue(cityFieldName, 0 as any);

    // Save to localStorage when user manually selects
    if (saveToLocalStorage) {
      setLocationPreferences((prev) => ({
        ...prev,
        countryGeonameId: geonameId,
        stateGeonameId: undefined,
        cityGeonameId: undefined,
      }));
    }
  };

  const handleStateChange = (stateGeonameIdStr: string) => {
    const geonameId = parseInt(stateGeonameIdStr);
    setSelectedState(geonameId);
    form.setValue(stateFieldName, geonameId as any);
    form.setValue(cityFieldName, 0 as any);

    // Save to localStorage when user manually selects
    if (saveToLocalStorage) {
      setLocationPreferences((prev) => ({
        ...prev,
        stateGeonameId: geonameId,
        cityGeonameId: undefined,
      }));
    }
  };

  const handleCityChange = (cityGeonameIdStr: string) => {
    const geonameId = parseInt(cityGeonameIdStr);
    form.setValue(cityFieldName, geonameId as any);

    // Save to localStorage when user manually selects
    if (saveToLocalStorage) {
      setLocationPreferences((prev) => ({
        ...prev,
        cityGeonameId: geonameId,
      }));
    }
  };

  return {
    // Data
    countries: countries || [],
    states: states || [],
    cities: cities || [],

    // Loading states
    countriesLoading,
    statesLoading,
    citiesLoading,

    // Watched values
    watchedCountryGeonameId,
    watchedStateGeonameId,
    watchedCityGeonameId,

    // Change handlers
    handleCountryChange,
    handleStateChange,
    handleCityChange,

    // Internal state (for advanced usage)
    selectedCountry,
    selectedState,

    // Location preferences
    locationPreferences,
    clearLocationPreferences: () => setLocationPreferences({}),
  };
}
