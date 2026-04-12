import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { resolveBilingualNames } from "@/core/location/api";
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
import { useEffect, useRef } from "react";
import type {
  FieldError as RHFFieldError,
  UseFormReturn,
} from "react-hook-form";
import { useTranslation } from "react-i18next";

interface LocationSelectorProps {
  form: UseFormReturn<any>;
  cityNameEnField?: string;
  cityNameArField?: string;
  stateNameEnField?: string;
  stateNameArField?: string;
  countryNameEnField?: string;
  countryNameArField?: string;
  isRequired?: boolean;
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
  cityNameEnField,
  cityNameArField,
  stateNameEnField,
  stateNameArField,
  countryNameEnField,
  countryNameArField,
  isRequired = false,
  errors,
}: LocationSelectorProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language === "ar" ? "ar" : "en";
  const { contains } = useFilter({ sensitivity: "base" });

  // Persist selected IDs across page reloads
  const [countryId, setCountryId] = useLocalStorage<number>(
    "loc_last_country_id",
    0,
  );
  const [stateId, setStateId] = useLocalStorage<number>("loc_last_state_id", 0);
  const [cityId, setCityId] = useLocalStorage<number>("loc_last_city_id", 0);

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

  // Awaits both EN and AR before writing — no race condition on submit.
  const writeNames = async (
    type: "country" | "state" | "city",
    id: number,
    currentName: string,
    enField?: string,
    arField?: string,
    parentId?: number,
  ) => {
    const { en, ar } = await resolveBilingualNames(
      type,
      id,
      lang,
      currentName,
      parentId,
    );
    if (enField) form.setValue(enField, en ?? ar ?? currentName);
    if (arField) form.setValue(arField, ar ?? en ?? currentName);
  };

  // City-states (Singapore, Vatican, etc.) have no ADM1 children — use country name for state+city
  useEffect(() => {
    if (
      countryId > 0 &&
      !statesLoading &&
      !statesError &&
      states.length === 0 &&
      !noStatesFallbackApplied.current
    ) {
      noStatesFallbackApplied.current = true;
      const country = countries.find((c) => c.geonameId === countryId);
      if (country) {
        writeNames(
          "country",
          countryId,
          country.name,
          stateNameEnField,
          stateNameArField,
        );
        writeNames(
          "country",
          countryId,
          country.name,
          cityNameEnField,
          cityNameArField,
        );
      }
    }
    if (countryId === 0) noStatesFallbackApplied.current = false;
  }, [countryId, statesLoading, states.length]);

  // Small territories may have states but no city-level data — use state name for city
  useEffect(() => {
    if (
      stateId > 0 &&
      !citiesLoading &&
      !citiesError &&
      cities.length === 0 &&
      !noCitiesFallbackApplied.current
    ) {
      noCitiesFallbackApplied.current = true;
      const state = states.find((s) => s.geonameId === stateId);
      if (state)
        writeNames(
          "state",
          stateId,
          state.name,
          cityNameEnField,
          cityNameArField,
          countryId,
        );
    }
    if (stateId === 0) noCitiesFallbackApplied.current = false;
  }, [stateId, citiesLoading, cities.length]);

  // Restore saved names on initial load (after data arrives)
  useEffect(() => {
    if (stateId > 0 && states.length > 0) {
      const state = states.find((s) => s.geonameId === stateId);
      if (state)
        form.setValue(
          lang === "en" ? stateNameEnField! : stateNameArField!,
          state.name,
        );
    }
  }, [states.length, stateId]);

  useEffect(() => {
    if (cityId > 0 && cities.length > 0) {
      const city = cities.find((c) => c.geonameId === cityId);
      if (city)
        form.setValue(
          lang === "en" ? cityNameEnField! : cityNameArField!,
          city.name,
        );
    }
  }, [cities.length, cityId]);

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
        onChange={async (id) => {
          setCountryId(id);
          setStateId(0);
          setCityId(0);
          noStatesFallbackApplied.current = false;
          noCitiesFallbackApplied.current = false;
          [
            stateNameEnField,
            stateNameArField,
            cityNameEnField,
            cityNameArField,
          ].forEach((f) => f && form.setValue(f, null));
          if (id) {
            const country = countries.find((c) => c.geonameId === id);
            if (country)
              await writeNames(
                "country",
                id,
                country.name,
                countryNameEnField,
                countryNameArField,
              );
          } else {
            [countryNameEnField, countryNameArField].forEach(
              (f) => f && form.setValue(f, null),
            );
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
          onChange={async (id) => {
            setStateId(id);
            setCityId(0);
            noCitiesFallbackApplied.current = false;
            [cityNameEnField, cityNameArField].forEach(
              (f) => f && form.setValue(f, null),
            );
            if (id) {
              const state = states.find((s) => s.geonameId === id);
              if (state)
                await writeNames(
                  "state",
                  id,
                  state.name,
                  stateNameEnField,
                  stateNameArField,
                  countryId,
                );
              // Also ensure country name is written — user may have selected
              // state without touching the country dropdown (e.g. restored from localStorage)
              if (countryId) {
                const country = countries.find(
                  (c) => c.geonameId === countryId,
                );
                if (country)
                  await writeNames(
                    "country",
                    countryId,
                    country.name,
                    countryNameEnField,
                    countryNameArField,
                  );
              }
            } else {
              [stateNameEnField, stateNameArField].forEach(
                (f) => f && form.setValue(f, null),
              );
            }
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
          onChange={async (id) => {
            setCityId(id);
            if (id) {
              // Save all three so restoring city also restores its parent context
              setStateId(stateId);
              setCountryId(countryId);
              const city = cities.find((c) => c.geonameId === id);
              if (city)
                await writeNames(
                  "city",
                  id,
                  city.name,
                  cityNameEnField,
                  cityNameArField,
                  stateId,
                );
            } else {
              [cityNameEnField, cityNameArField].forEach(
                (f) => f && form.setValue(f, null),
              );
            }
          }}
        />
      )}
    </div>
  );
}
