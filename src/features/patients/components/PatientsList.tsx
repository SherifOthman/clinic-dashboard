import { DataTable } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { useDebounce } from "@/core/hooks/useDebounce";
import { isSuperAdmin } from "@/core/utils/roleUtils";
import { useMe } from "@/features/auth/hooks";
import { Button, Label, ListBox, SearchField, Select } from "@heroui/react";
import { UserPlus } from "lucide-react";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  usePaginatedPatients,
  usePatientLocationFilter,
  usePatientsTableState,
} from "../patientsHooks";
import type { PatientListItem } from "../types";
import { PatientCityFilter } from "./PatientCityFilter";
import { getPatientColumns } from "./patientColumns";
import { PatientCountryFilter } from "./PatientCountryFilter";
import { PatientStateFilter } from "./PatientStateFilter";

interface PatientsListProps {
  onPatientCreate: () => void;
  onPatientView: (patient: PatientListItem) => void;
}

export function PatientsList({
  onPatientCreate,
  onPatientView,
}: PatientsListProps) {
  const { t, i18n } = useTranslation();
  const { formatDateShort } = useDateFormat();
  const isRTL = i18n.language === "ar";
  const { user } = useMe();
  const superAdmin = isSuperAdmin(user);

  const { patientsState, updatePatientsState } = usePatientsTableState();

  const debouncedSearch = useDebounce(patientsState.searchTerm ?? "", 400);
  const debouncedClinicSearch = useDebounce(
    patientsState.clinicSearch ?? "",
    400,
  );

  const { data, isLoading, error } = usePaginatedPatients(
    {
      ...patientsState,
      searchTerm: debouncedSearch || undefined,
      clinicSearch: debouncedClinicSearch || undefined,
    },
    superAdmin,
  );

  // Eagerly fetch location filter — builds city name map for the table column
  const { data: locationFilter } = usePatientLocationFilter(true);
  const cityNameMap = useMemo(() => {
    const map = new Map<number, string>();
    locationFilter?.cities.forEach((c) => map.set(c.geonameId, c.name));
    return map;
  }, [locationFilter]);

  const tableKey = `${i18n.language}-${cityNameMap.size}`;

  const columns = getPatientColumns({
    t,
    formatDate: formatDateShort,
    isAr: i18n.language === "ar",
    showClinic: superAdmin,
    cityNameMap,
  });

  if (error) {
    return (
      <div className="py-8 text-center">
        <p className="text-danger">{t("patients.failedToLoad")}</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-wrap gap-3">
          {/* Name / code / phone search */}
          <SearchField
            value={patientsState.searchTerm ?? ""}
            onChange={(v) => updatePatientsState({ searchTerm: v })}
            aria-label={t("patients.searchPlaceholder")}
            className="min-w-0 flex-1 sm:max-w-xs"
          >
            <Label className="sr-only">{t("patients.searchPlaceholder")}</Label>
            <SearchField.Group>
              <SearchField.SearchIcon className="ms-3" />
              <SearchField.Input
                placeholder={t("patients.searchPlaceholder")}
              />
              <SearchField.ClearButton />
            </SearchField.Group>
          </SearchField>

          {/* Gender filter */}
          <Select
            className="w-full sm:w-44"
            placeholder={t("patients.allGenders")}
            value={
              patientsState.gender === "Male" ||
              patientsState.gender === "Female"
                ? patientsState.gender
                : null
            }
            onChange={(v) =>
              updatePatientsState({
                gender: v === "Male" || v === "Female" ? v : undefined,
              })
            }
            aria-label={t("patients.filterByGender")}
          >
            <Select.Trigger>
              <Select.Value className={isRTL ? "text-right" : ""} />
              <Select.Indicator />
            </Select.Trigger>
            <Select.Popover>
              <ListBox dir={isRTL ? "rtl" : "ltr"}>
                <ListBox.Item id="all" textValue={t("patients.allGenders")}>
                  {t("patients.allGenders")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="Male" textValue={t("common.fields.male")}>
                  {t("common.fields.male")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
                <ListBox.Item id="Female" textValue={t("common.fields.female")}>
                  {t("common.fields.female")}
                  <ListBox.ItemIndicator />
                </ListBox.Item>
              </ListBox>
            </Select.Popover>
          </Select>

          {/* Country → State → City (dependent, all users) */}
          <PatientCountryFilter
            value={patientsState.countryGeonameId}
            onChange={(v) =>
              updatePatientsState({
                countryGeonameId: v ?? undefined,
                stateGeonameId: undefined,
                cityGeonameId: undefined,
              })
            }
          />

          <PatientStateFilter
            value={patientsState.stateGeonameId}
            countryGeonameId={patientsState.countryGeonameId}
            onChange={(v) =>
              updatePatientsState({
                stateGeonameId: v ?? undefined,
                cityGeonameId: undefined,
              })
            }
          />

          <PatientCityFilter
            value={patientsState.cityGeonameId}
            stateGeonameId={patientsState.stateGeonameId}
            onChange={(v) =>
              updatePatientsState({ cityGeonameId: v ?? undefined })
            }
          />

          {/* Clinic search — SuperAdmin only */}
          {superAdmin && (
            <SearchField
              value={patientsState.clinicSearch ?? ""}
              onChange={(v) =>
                updatePatientsState({ clinicSearch: v || undefined })
              }
              aria-label={t("patients.filterByClinic")}
              className="w-full sm:w-64"
            >
              <Label className="sr-only">{t("patients.filterByClinic")}</Label>
              <SearchField.Group>
                <SearchField.SearchIcon className="ms-3" />
                <SearchField.Input placeholder={t("patients.filterByClinic")} />
                <SearchField.ClearButton />
              </SearchField.Group>
            </SearchField>
          )}
        </div>

        {!superAdmin && (
          <Button
            variant="primary"
            onPress={onPatientCreate}
            className="w-full sm:w-auto"
          >
            <UserPlus className="h-4 w-4" />
            {t("patients.addPatient")}
          </Button>
        )}
      </div>

      <DataTable
        key={tableKey}
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage={t("common.noResults")}
        sortBy={patientsState.sortBy}
        sortDirection={patientsState.sortDirection}
        onSortChange={(sortBy, sortDirection) =>
          updatePatientsState({ sortBy, sortDirection, pageNumber: 1 })
        }
        onRowClick={onPatientView}
      />

      <TablePagination
        data={data}
        currentPage={patientsState.pageNumber ?? 1}
        onPageChange={(p) => updatePatientsState({ pageNumber: p })}
        onPageSizeChange={(s) =>
          updatePatientsState({ pageSize: s, pageNumber: 1 })
        }
      />
    </div>
  );
}
