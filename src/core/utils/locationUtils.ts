export interface LocationFormData {
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
  geoNameId?: number;
}

export function transformLocationToBackend<T extends LocationFormData>(
  formData: T,
): Omit<T, "countryGeonameId" | "stateGeonameId" | "cityGeonameId"> & {
  geoNameId?: number;
} {
  const {
    countryGeonameId: _countryGeonameId,
    stateGeonameId: _stateGeonameId,
    cityGeonameId,
    ...rest
  } = formData;

  // Suppress unused variable warnings - these are intentionally destructured and ignored
  void _countryGeonameId;
  void _stateGeonameId;

  return {
    ...rest,
    geoNameId: cityGeonameId && cityGeonameId > 0 ? cityGeonameId : undefined,
  } as Omit<T, "countryGeonameId" | "stateGeonameId" | "cityGeonameId"> & {
    geoNameId?: number;
  };
}

export function transformLocationFromBackend<T extends { geoNameId?: number }>(
  backendData: T,
): T & LocationFormData {
  return {
    ...backendData,
    countryGeonameId: 0,
    stateGeonameId: 0,
    cityGeonameId: backendData.geoNameId || 0,
  };
}

export function validateLocationSelection(data: LocationFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (data.countryGeonameId && data.countryGeonameId > 0) {
    if (!data.stateGeonameId || data.stateGeonameId <= 0) {
      errors.push("State is required when country is selected");
    }

    if (!data.cityGeonameId || data.cityGeonameId <= 0) {
      errors.push("City is required when country is selected");
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

export function isLocationComplete(data: LocationFormData): boolean {
  return !!(
    data.countryGeonameId &&
    data.countryGeonameId > 0 &&
    data.stateGeonameId &&
    data.stateGeonameId > 0 &&
    data.cityGeonameId &&
    data.cityGeonameId > 0
  );
}

export function getDefaultLocationValues(): LocationFormData {
  return {
    countryGeonameId: 0,
    stateGeonameId: 0,
    cityGeonameId: 0,
    geoNameId: undefined,
  };
}
