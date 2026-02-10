import {
  FilterPanel,
  type FilterOption,
  type FilterValues,
} from "@/core/components/ui/FilterPanel";
import { useTranslation } from "react-i18next";
import type { PatientsSearchParams } from "../types/patient";

interface PatientsFilterProps {
  filters: PatientsSearchParams;
  onChange: (filters: PatientsSearchParams) => void;
  onClear: () => void;
}

export function PatientsFilter({
  filters,
  onChange,
  onClear,
}: PatientsFilterProps) {
  const { t } = useTranslation();
  const filterOptions: FilterOption[] = [
    {
      key: "gender",
      label: "Gender",
      type: "select",
      options: [
        { key: "0", label: "Female", value: 0 },
        { key: "1", label: "Male", value: 1 },
      ],
      placeholder: t("patients.selectGender"),
    },
  ];

  const handleFilterChange = (values: FilterValues) => {
    const updatedFilters: PatientsSearchParams = {
      ...filters,
      gender: values.gender,
      pageNumber: 1,
    };
    onChange(updatedFilters);
  };

  const handleClearFilters = () => {
    const clearedFilters: PatientsSearchParams = {
      ...filters,
      gender: undefined,
      pageNumber: 1,
    };
    onChange(clearedFilters);
    onClear();
  };

  const filterValues: FilterValues = {
    gender: filters.gender,
  };

  return (
    <FilterPanel
      filters={filterOptions}
      values={filterValues}
      onChange={handleFilterChange}
      onClear={handleClearFilters}
      title={t("patients.patientFilters")}
      isCollapsible={true}
    />
  );
}
