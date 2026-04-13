import { useCities, useCountries, useStates } from "@/core/location/hooks";
import {
  Autocomplete,
  EmptyState,
  FieldError,
  Label,
  ListBox,
  SearchField,
  useFilter,
} from "@heroui/react";
import { useEffect, useRef, useState } from "react";
import type {
  FieldError as RHFFieldError,
  UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

const LAST_LOCATION_KEY = "last_patient_location";

interface LastLocation {
  countryId: number;
  stateId: number;
  cityId: number;
}

interface LocationSelectorProps {
  form: UseFormReturn<any>;
  countryGeonameIdField?: string;
  stateGeonameIdField?: string;
  cityGeonameIdField?: string;
  isRequired?: boolean;
  /** Called when the user selects a country — provides the ISO 3166-1 alpha-2 code (e.g. "EG") */
  onCountryCodeChange?: (code: string | null) => void;
  errors?: {
    country?: RHFFieldError;
    state?: RHFFieldError;
    city?: RHFFieldError;
  };
}

// ── Shared Autocomplete UI ────────────────────────────────────────────────────

interface LocationAutocompleteProps {
  label: string;
  placeholder: string;
  value: number;
  onChange: (id: number) => void;
  items: { geonameId: number; name: string }[];
  isRequired?: boolean;
  isDisabled?: boolean;
  isInvalid?: boolean;
  error?: RHFFieldError;
  loadError?: boolean;
  lang: string;
  contains: (text: string, filter: string) => boolean;
  t: (key: string) => string;
}

function LocationAutocomplete({
  label,
  placeholder,
  value,
  onChange,
  items,
  isRequired,
  isDisabled,
  isInvalid,
  error,
  loadError,
  lang,
  contains,
  t,
}: LocationAutocompleteProps) {
  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <Autocomplete
      isRequired={isRequired}
      isInvalid={isInvalid}
      isDisabled={isDisabled}
      placeholder={placeholder}
      selectionMode="single"
      value={value > 0 ? value.toString() : null}
      onChange={(key) => onChange(key ? parseInt(key as string) : 0)}
    >
      <Label>{label}</Label>
      <Autocomplete.Trigger>
        <Autocomplete.Value />
        <Autocomplete.ClearButton />
        <Autocomplete.Indicator />
      </Autocomplete.Trigger>
      <Autocomplete.Popover>
        <Autocomplete.Filter filter={contains}>
          <SearchField variant="secondary">
            <SearchField.Group>
              <SearchField.SearchIcon className="ms-3" />
              <SearchField.Input placeholder={t("common.search")} dir={dir} />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>
          <ListBox
            renderEmptyState={() =>
              loadError ? (
                <EmptyState className="text-danger">
                  {t("location.loadError")}
                </EmptyState>
              ) : (
                <EmptyState>{t("common.noResults")}</EmptyState>
              )
            }
            dir={dir}
          >
            {items.map((item) => (
              <ListBox.Item
                key={item.geonameId}
                id={item.geonameId.toString()}
                textValue={item.name}
              >
                {item.name}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            ))}
          </ListBox>
        </Autocomplete.Filter>
      </Autocomplete.Popover>
      {error && <FieldError>{error.message}</FieldError>}
    </Autocomplete>
  );
}

// ── Main component ────────────────────────────────────────────────────────────

export function LocationSelector({
  form,
  countryGeonameIdField,
  stateGeonameIdField,
  cityGeonameIdField,
  isRequired = false,
  onCountryCodeChange,
  errors,
}: LocationSelectorProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { contains } = useFilter({ sensitivity: "base" });

  const [lastLocation, setLastLocation] = useLocalStorage<LastLocation | null>(
    LAST_LOCATION_KEY,
    null,
  );

  // Read initial values from form fields (supports edit mode)
  const initialCountry = countryGeonameIdField
    ? (form.getValues(countryGeonameIdField) ?? 0)
    : 0;
  const initialState = stateGeonameIdField
    ? (form.getValues(stateGeonameIdField) ?? 0)
    : 0;
  const initialCity = cityGeonameIdField
    ? (form.getValues(cityGeonameIdField) ?? 0)
    : 0;

  // For new patients (no existing values), pre-fill from last used location
  const isNewForm = !initialCountry && !initialState && !initialCity;
  const prefill = isNewForm && lastLocation ? lastLocation : null;

  const [countryId, setCountryId] = useState<number>(
    prefill?.countryId ?? initialCountry,
  );
  const [stateId, setStateId] = useState<number>(
    prefill?.stateId ?? initialState,
  );
  const [cityId, setCityId] = useState<number>(prefill?.cityId ?? initialCity);

  // Apply prefill to form on mount (new form only)
  const prefillApplied = useRef(false);
  useEffect(() => {
    if (!prefill || prefillApplied.current) return;
    prefillApplied.current = true;
    if (countryGeonameIdField && prefill.countryId)
      form.setValue(countryGeonameIdField, prefill.countryId);
    if (stateGeonameIdField && prefill.stateId)
      form.setValue(stateGeonameIdField, prefill.stateId);
    if (cityGeonameIdField && prefill.cityId)
      form.setValue(cityGeonameIdField, prefill.cityId);
  }, []);

  // Prevent re-applying fallbacks after they already ran
  const noStatesFallbackApplied = useRef(false);
  const noCitiesFallbackApplied = useRef(false);

  const {
    data: countries = [],
    isLoading: countriesLoading,
    error: countriesError,
  } = useCountries();
  const {
    data: states = [],
    isLoading: statesLoading,
    error: statesError,
  } = useStates(countryId > 0 ? countryId : null);
  const {
    data: cities = [],
    isLoading: citiesLoading,
    error: citiesError,
  } = useCities(stateId > 0 ? stateId : null);

  // When form values change externally (e.g. edit mode populates), sync local state
  useEffect(() => {
    const sub = form.watch((values) => {
      if (countryGeonameIdField) {
        const v = values[countryGeonameIdField] ?? 0;
        setCountryId(v);
      }
      if (stateGeonameIdField) {
        const v = values[stateGeonameIdField] ?? 0;
        setStateId(v);
      }
      if (cityGeonameIdField) {
        const v = values[cityGeonameIdField] ?? 0;
        setCityId(v);
      }
    });
    return () => sub.unsubscribe();
  }, [form, countryGeonameIdField, stateGeonameIdField, cityGeonameIdField]);

  // City-states (Singapore, Vatican, etc.) have no ADM1 children — use country for state+city
  useEffect(() => {
    if (
      countryId > 0 &&
      !statesLoading &&
      !statesError &&
      states.length === 0 &&
      !noStatesFallbackApplied.current
    ) {
      noStatesFallbackApplied.current = true;
      // Store the country ID as both state and city fallback
      if (stateGeonameIdField) form.setValue(stateGeonameIdField, countryId);
      if (cityGeonameIdField) form.setValue(cityGeonameIdField, countryId);
    }
    if (countryId === 0) noStatesFallbackApplied.current = false;
  }, [countryId, statesLoading, states.length]);

  // Small territories may have states but no city-level data — use state for city
  useEffect(() => {
    if (
      stateId > 0 &&
      !citiesLoading &&
      !citiesError &&
      cities.length === 0 &&
      !noCitiesFallbackApplied.current
    ) {
      noCitiesFallbackApplied.current = true;
      if (cityGeonameIdField) form.setValue(cityGeonameIdField, stateId);
    }
    if (stateId === 0) noCitiesFallbackApplied.current = false;
  }, [stateId, citiesLoading, cities.length]);

  if (countriesError)
    return <p className="text-danger text-sm">{t("location.loadError")}</p>;

  const stateAutoFilled =
    countryId > 0 && !statesLoading && states.length === 0;
  const cityAutoFilled = stateId > 0 && !citiesLoading && cities.length === 0;

  const sharedProps = { lang, contains, t };

  return (
    <div className="grid grid-cols-1 gap-4">
      <LocationAutocomplete
        {...sharedProps}
        label={t("location.country")}
        placeholder={t("location.selectCountry")}
        value={countryId}
        items={countries}
        isRequired={isRequired}
        isDisabled={countriesLoading}
        isInvalid={!!errors?.country}
        error={errors?.country}
        onChange={(id) => {
          setCountryId(id);
          setStateId(0);
          setCityId(0);
          noStatesFallbackApplied.current = false;
          noCitiesFallbackApplied.current = false;

          if (countryGeonameIdField)
            form.setValue(countryGeonameIdField, id || null);
          if (stateGeonameIdField) form.setValue(stateGeonameIdField, null);
          if (cityGeonameIdField) form.setValue(cityGeonameIdField, null);

          if (id) {
            const country = countries.find((c) => c.geonameId === id);
            onCountryCodeChange?.(country?.countryCode ?? null);
          } else {
            onCountryCodeChange?.(null);
          }
        }}
      />

      {!stateAutoFilled && (
        <LocationAutocomplete
          {...sharedProps}
          label={t("location.state")}
          placeholder={t("location.selectState")}
          value={stateId}
          items={states}
          isDisabled={!countryId || statesLoading}
          isInvalid={!!errors?.state}
          error={errors?.state}
          loadError={!!statesError}
          onChange={(id) => {
            setStateId(id);
            setCityId(0);
            noCitiesFallbackApplied.current = false;

            if (stateGeonameIdField)
              form.setValue(stateGeonameIdField, id || null);
            if (cityGeonameIdField) form.setValue(cityGeonameIdField, null);
            // Save partial location (country + state) — city will update it further
            if (id) setLastLocation({ countryId, stateId: id, cityId: 0 });
          }}
        />
      )}

      {!cityAutoFilled && (
        <LocationAutocomplete
          {...sharedProps}
          label={t("location.city")}
          placeholder={
            citiesLoading ? t("common.loading") : t("location.selectCity")
          }
          value={cityId}
          items={cities}
          isRequired={isRequired && !stateAutoFilled}
          isDisabled={(!stateId && !stateAutoFilled) || citiesLoading}
          isInvalid={!!errors?.city}
          error={errors?.city}
          loadError={!!citiesError}
          onChange={(id) => {
            setCityId(id);
            if (cityGeonameIdField)
              form.setValue(cityGeonameIdField, id || null);
            // Save the completed location selection for next time
            if (id) {
              setLastLocation({ countryId, stateId, cityId: id });
            }
          }}
        />
      )}
    </div>
  );
}
