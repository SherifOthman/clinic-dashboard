import { DataTable } from "@/core/components/ui/DataTable";
import { TablePagination } from "@/core/components/ui/TablePagination";
import { useDateFormat } from "@/core/hooks/useDateFormat";
import { isClinicOwner, isDoctor } from "@/core/utils/roleUtils";
import { useMe } from "@/features/auth/hooks";
import { Button, ListBox, Select } from "@heroui/react";
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
  const isRTL = i18n.language === "ar";

  const { staffState, updateBaseState, updateParam, roleFilter, activeFilter } =
    useStaffTableState();

  const { data, isLoading } = useStaffList(staffState);

  const toggleActive = useSetStaffActiveStatus();

  const handleToggleActive = (staff: StaffDto) => {
    toggleActive.mutate({ id: staff.id, isActive: !staff.isActive });
  };

  const columns = getStaffColumns({
    t,
    isRTL,
    formatDate: formatDateShort,
    currentUser: user,
    onToggleActive: handleToggleActive,
    pendingId: toggleActive.isPending ? toggleActive.variables?.id : undefined,
  });

  return (
    <div className="flex flex-col gap-4 py-4">
      {/* Owner banner */}
      {isClinicOwner(user) && !isDoctor(user) && (
        <div className="border-accent/10 bg-accent/5 flex flex-col gap-3 rounded-lg border p-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-medium">{t("staff.ownerDoctor.title")}</p>
            <p className="text-default-500 text-sm">
              {t("staff.ownerDoctor.subtitle")}
            </p>
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

      {/* Filters */}
      <div className="flex flex-wrap gap-3">
        <Select
          className="w-full sm:w-48"
          placeholder={t("staff.allRoles")}
          value={roleFilter || null}
          onChange={(v) => updateParam("role", v ? String(v) : null)}
          aria-label={t("staff.filterByRole")}
        >
          <Select.Trigger>
            <Select.Value className={isRTL ? "text-right" : ""} />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox dir={isRTL ? "rtl" : "ltr"}>
              <ListBox.Item id="" textValue={t("staff.allRoles")}>
                {t("staff.allRoles")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="Doctor" textValue={t("staff.roles.Doctor")}>
                {t("staff.roles.Doctor")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item
                id="Receptionist"
                textValue={t("staff.roles.Receptionist")}
              >
                {t("staff.roles.Receptionist")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>

        <Select
          className="w-full sm:w-48"
          placeholder={t("staff.allStatuses")}
          value={activeFilter ?? null}
          onChange={(v) => updateParam("active", v ? String(v) : null)}
          aria-label={t("staff.filterByStatus")}
        >
          <Select.Trigger>
            <Select.Value className={isRTL ? "text-right" : ""} />
            <Select.Indicator />
          </Select.Trigger>
          <Select.Popover>
            <ListBox dir={isRTL ? "rtl" : "ltr"}>
              <ListBox.Item id="" textValue={t("staff.allStatuses")}>
                {t("staff.allStatuses")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="true" textValue={t("common.status.active")}>
                {t("common.status.active")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
              <ListBox.Item id="false" textValue={t("common.status.inactive")}>
                {t("common.status.inactive")}
                <ListBox.ItemIndicator />
              </ListBox.Item>
            </ListBox>
          </Select.Popover>
        </Select>
      </div>

      <DataTable
        key={i18n.language}
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(item) => item.id}
        isLoading={isLoading}
        emptyMessage={t("staff.noStaff")}
        sortBy={staffState.sortBy || undefined}
        sortDirection={staffState.sortDirection}
        onSortChange={(sortBy, sortDirection) =>
          updateBaseState({ sortBy, sortDirection, pageNumber: 1 })
        }
        onRowClick={(item) => setDetailStaffId(item.id)}
      />

      <TablePagination
        data={data}
        currentPage={staffState.pageNumber ?? 1}
        onPageChange={(p) => updateBaseState({ pageNumber: p })}
        onPageSizeChange={(s) =>
          updateBaseState({ pageSize: s, pageNumber: 1 })
        }
      />

      <StaffDetailDialog
        staffId={detailStaffId}
        onClose={() => setDetailStaffId(null)}
      />
    </div>
  );
}
