import { DataTable } from "@/core/components/ui/DataTable";
import { FilterSelect } from "@/core/components/ui/FilterSelect";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { USER_ROLES } from "@/core/constants";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { isClinicOwner, isDoctor } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Button } from "@heroui/react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useSetStaffActiveStatus, useStaffList } from "../staffHooks";
import { useStaffTableState } from "../staffTableState";
import type { StaffDto } from "../types";
import { SetOwnerAsDoctorModal } from "./SetOwnerAsDoctorModal";
import { StaffDetailDialog } from "./StaffDetailDialog";
import { getStaffColumns } from "./staffColumns";

export function Staff() {
  const { t, i18n } = useTranslation();
  const { user } = useMe();
  const { formatDateShort } = useDateFormat();
  const [detailStaffId, setDetailStaffId] = useState<string | null>(null);

  const { staffState, updateStaffState, roleFilter, activeFilter } = useStaffTableState();
  const { data, isLoading } = useStaffList(staffState);

  // Filter out the clinic owner — they don't need to see themselves in the list
  const filteredItems =
    data?.items.filter((s) => !s.roles.some((r) => r.name === USER_ROLES.CLINIC_OWNER)) ?? [];

  const toggleActive = useSetStaffActiveStatus();
  const handleToggleActive = (staff: StaffDto) =>
    toggleActive.mutate({ id: staff.id, isActive: !staff.isActive });

  const columns = getStaffColumns({
    t,
    isRTL: i18n.language === "ar",
    formatDate: formatDateShort,
    currentUser: user,
    onToggleActive: handleToggleActive,
    pendingId: toggleActive.isPending ? toggleActive.variables?.id : undefined,
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Owner banner — shown when owner hasn't set up their doctor profile yet */}
      {isClinicOwner(user) && !isDoctor(user) && (
        <div className="border-accent/10 bg-accent/5 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{t("staff.ownerDoctor.title")}</p>
            <p className="text-default-500 text-sm">{t("staff.ownerDoctor.subtitle")}</p>
          </div>
          <SetOwnerAsDoctorModal
            trigger={
              <Button variant="outline" size="sm" className="w-full sm:w-auto">
                {t("staff.ownerDoctor.action")}
              </Button>
            }
          />
        </div>
      )}

      <div className="flex flex-wrap gap-3">
        <FilterSelect
          value={roleFilter}
          onChange={(v) => updateStaffState({ role: v })}
          placeholder={t("staff.allRoles")}
          ariaLabel={t("staff.filterByRole")}
          options={[
            { id: "Doctor", label: t("staff.roles.Doctor") },
            { id: "Receptionist", label: t("staff.roles.Receptionist") },
          ]}
        />
        <FilterSelect
          value={activeFilter}
          onChange={(v) =>
            updateStaffState({ isActive: v === "true" ? true : v === "false" ? false : undefined })
          }
          placeholder={t("staff.allStatuses")}
          ariaLabel={t("staff.filterByStatus")}
          options={[
            { id: "true", label: t("common.status.active") },
            { id: "false", label: t("common.status.inactive") },
          ]}
        />
      </div>

      <DataTable
        key={i18n.language}
        columns={columns}
        data={filteredItems}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage={t("staff.noStaff")}
        sortBy={staffState.sortBy || undefined}
        sortDirection={staffState.sortDirection}
        onSortChange={(sortBy, sortDirection) =>
          updateStaffState({ sortBy, sortDirection, pageNumber: 1 })
        }
        onRowClick={(item) => setDetailStaffId(item.id)}
      />

      <TablePagination
        data={data}
        currentPage={staffState.pageNumber ?? 1}
        onPageChange={(p) => updateStaffState({ pageNumber: p })}
        onPageSizeChange={(s) => updateStaffState({ pageSize: s, pageNumber: 1 })}
      />

      <StaffDetailDialog staffId={detailStaffId} onClose={() => setDetailStaffId(null)} />
    </div>
  );
}
