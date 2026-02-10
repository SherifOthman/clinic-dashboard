import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { useLocationState } from "@/core/hooks/useLocationState";
import { transformLocationToBackend } from "@/core/utils/locationUtils";
import { setServerErrors } from "@/core/utils/setServerErrors";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import {
  createPatientSchema,
  updatePatientSchema,
  type CreatePatientFormData,
  type UpdatePatientFormData,
} from "../schemas/patientSchemas";
import type { PatientDto } from "../types/patient";
import {
  getNewPatientDefaults,
  getPatientFormDefaults,
  syncAgeAndDateOfBirth,
} from "../utils/patientFormUtils";

interface LocationPreferences {
  countryGeonameId?: number;
  stateGeonameId?: number;
  cityGeonameId?: number;
}

interface UsePatientFormOptions {
  patient?: PatientDto;
  onSubmit: (data: CreatePatientFormData | UpdatePatientFormData) => void;
  error?: any;
}

export function usePatientForm({
  patient,
  onSubmit,
  error,
}: UsePatientFormOptions) {
  const isEditing = !!patient;
  const schema = isEditing ? updatePatientSchema : createPatientSchema;

  // Location preferences from localStorage
  const [locationPreferences] = useLocalStorage<LocationPreferences>(
    "patient-location-preferences",
    { countryGeonameId: 0, stateGeonameId: 0, cityGeonameId: 0 },
  );

  // Form setup with initial defaults
  const form = useForm<CreatePatientFormData | UpdatePatientFormData>({
    resolver: zodResolver(schema) as any,
    defaultValues:
      isEditing && patient
        ? getPatientFormDefaults(patient)
        : getNewPatientDefaults(),
  });

  // Reset form when patient data changes or location preferences change
  useEffect(() => {
    if (isEditing && patient) {
      const defaults = getPatientFormDefaults(patient);
      form.reset(defaults);
    } else if (!isEditing) {
      // For new patients, always reset with location preferences
      const defaults = getNewPatientDefaults();
      const defaultsWithLocation = {
        ...defaults,
        countryGeonameId: locationPreferences.countryGeonameId || 0,
        stateGeonameId: locationPreferences.stateGeonameId || 0,
        cityGeonameId: locationPreferences.cityGeonameId || 0,
      };
      form.reset(defaultsWithLocation);
    }
  }, [
    patient?.id,
    isEditing,
    locationPreferences.countryGeonameId,
    locationPreferences.stateGeonameId,
    locationPreferences.cityGeonameId,
  ]);

  // Location state with local storage
  const locationState = useLocationState({
    form,
    saveToLocalStorage: true,
    localStorageKey: "patient-location-preferences",
  });

  // Error handling
  useEffect(() => {
    if (error) {
      setServerErrors(error, form.setError);
    }
  }, [error]);

  // Form submission handler
  const handleFormSubmit = (
    data: CreatePatientFormData | UpdatePatientFormData,
  ) => {
    const transformedData = transformLocationToBackend(data);

    // Don't convert gender here - keep as string for form
    const finalData = transformedData;

    onSubmit(finalData as CreatePatientFormData | UpdatePatientFormData);
  };

  // Age and date of birth sync
  const handleAgeChange = (age: number) => {
    syncAgeAndDateOfBirth("age", age, form);
  };

  const handleDateOfBirthChange = (dateOfBirth: string) => {
    syncAgeAndDateOfBirth("dateOfBirth", dateOfBirth, form);
  };

  return {
    // Form
    form,
    isEditing,
    handleFormSubmit,

    // Data
    locationState,

    // Age management
    handleAgeChange,
    handleDateOfBirthChange,
  };
}
