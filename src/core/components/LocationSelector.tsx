import {
  useLocationSelection,
  type LocationData,
} from "@/core/hooks/useLocationSelection";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import type { Key } from "react";
import { useTranslation } from "react-i18next";

interface LocationSelectorProps {
  onLocationChange: (location: LocationData) => void;
  isRequired?: boolean;
  variant?: "flat" | "bordered" | "faded" | "underlined";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LocationSelector({
  onLocationChange,
  isRequired = false,
  variant = "bordered",
  size = "md",
  className = "",
}: LocationSelectorProps) {
  const { t, i18n } = useTranslation();
  const isArabic = i18n.language === "ar";

  const {
    countries,
    states,
    cities,
    countriesLoading,
    statesLoading,
    citiesLoading,
    selectedCountry,
    selectedState,
    selectedCity,
    handleCountryChange,
    handleStateChange,
    handleCityChange,
  } = useLocationSelection(onLocationChange);

  const getLocalizedName = (name: { en: string; ar: string }): string => {
    return isArabic ? name.ar : name.en;
  };

  return (
    <div className={`grid grid-cols-1 md:grid-cols-3 gap-4 ${className}`}>
      <Autocomplete
        label={t("location.country")}
        placeholder={t("location.selectCountry")}
        variant={variant}
        size={size}
        selectedKey={
          selectedCountry ? selectedCountry.geonameId.toString() : null
        }
        onSelectionChange={(key: Key | null) => {
          if (key) {
            handleCountryChange(parseInt(key.toString()));
          }
        }}
        defaultItems={countries}
        isLoading={countriesLoading}
        isRequired={isRequired}
        listboxProps={{
          className: "max-h-[400px]",
        }}
      >
        {(country) => (
          <AutocompleteItem
            key={country.geonameId}
            textValue={getLocalizedName(country.name)}
          >
            {getLocalizedName(country.name)}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        label={t("location.state")}
        placeholder={t("location.selectState")}
        variant={variant}
        size={size}
        selectedKey={selectedState ? selectedState.geonameId.toString() : null}
        onSelectionChange={(key: Key | null) => {
          if (key) {
            handleStateChange(parseInt(key.toString()));
          }
        }}
        defaultItems={states}
        isLoading={statesLoading}
        isDisabled={!selectedCountry}
        listboxProps={{
          className: "max-h-[400px]",
        }}
      >
        {(state) => (
          <AutocompleteItem
            key={state.geonameId}
            textValue={getLocalizedName(state.name)}
          >
            {getLocalizedName(state.name)}
          </AutocompleteItem>
        )}
      </Autocomplete>

      <Autocomplete
        label={t("location.city")}
        placeholder={t("location.selectCity")}
        variant={variant}
        size={size}
        selectedKey={selectedCity ? selectedCity.geonameId.toString() : null}
        onSelectionChange={(key: Key | null) => {
          if (key) {
            handleCityChange(parseInt(key.toString()));
          }
        }}
        defaultItems={cities}
        isLoading={citiesLoading}
        isDisabled={!selectedState}
        isRequired={isRequired}
        listboxProps={{
          className: "max-h-[400px]",
        }}
      >
        {(city) => (
          <AutocompleteItem
            key={city.geonameId}
            textValue={getLocalizedName(city.name)}
          >
            {getLocalizedName(city.name)}
          </AutocompleteItem>
        )}
      </Autocomplete>
    </div>
  );
}
