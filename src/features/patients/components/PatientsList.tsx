import { DataTable } from "@/core/components/ui/DataTable";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { useDebounce } from "@/core/hooks/useDebounce";
import { canCreatePatient, isSuperAdmin } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button, Label, SearchField } from "@heroui/react";
import { UserPlus } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAdminPaginatedPatients, usePaginatedPatients, usePatientsTableState } from "../patientsHooks";
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
  const { user } = useMe();
  const superAdmin = isSuperAdmin(user);

  const { patientsState, updatePatientsState } = usePatientsTableState();

  const debouncedSearch = useDebounce(patientsState.searchTerm ?? "", 400);
  const debouncedClinicSearch = useDebounce(
    patientsState.clinicSearch ?? "",
    400,
  );

  const { data, isLoading, error } = superAdmin
    ? useAdminPaginatedPatients({
        ...patientsState,
        searchTerm: debouncedSearch || undefined,
        clinicSearch: debouncedClinicSearch || undefined,
      })
    : usePaginatedPatients({
        ...patientsState,
        searchTerm: debouncedSearch || undefined,
      });

  const tableKey = i18n.language;

  const columns = getPatientColumns({
    t,
    formatDate: formatDateShort,
    isAr: i18n.language === "ar",
    showClinic: superAdmin,
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
          <FilterSelect
            value={
              patientsState.gender === "Male" || patientsState.gender === "Female"
                ? patientsState.gender
                : undefined
            }
            onChange={(v) =>
              updatePatientsState({
                gender: v === "Male" || v === "Female" ? v : undefined,
              })
            }
            placeholder={t("patients.allGenders")}
            ariaLabel={t("patients.filterByGender")}
            options={[
              { id: "Male",   label: t("common.fields.male") },
              { id: "Female", label: t("common.fields.female") },
            ]}
            className="w-full sm:w-44"
          />

          {/* Country â†’ State â†’ City: each step only appears after the previous is selected */}
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

          {patientsState.countryGeonameId && (
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
          )}

          {patientsState.stateGeonameId && (
            <PatientCityFilter
              value={patientsState.cityGeonameId}
              stateGeonameId={patientsState.stateGeonameId}
              onChange={(v) =>
                updatePatientsState({ cityGeonameId: v ?? undefined })
              }
            />
          )}

          {/* Clinic search â€” SuperAdmin only */}
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

        {!superAdmin && canCreatePatient(user) && (
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
