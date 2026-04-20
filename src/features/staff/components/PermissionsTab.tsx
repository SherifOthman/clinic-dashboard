import { PERMISSIONS, type Permission } from "@/core/constants";
import { Checkbox } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useGetPermissions, useSetPermissions } from "../staffHooks";

// Permission groups for display
const PERMISSION_GROUPS: { labelKey: string; permissions: Permission[] }[] = [
  {
    labelKey: "staff.permissions.groups.patients",
    permissions: [
      PERMISSIONS.VIEW_PATIENTS,
      PERMISSIONS.CREATE_PATIENT,
      PERMISSIONS.EDIT_PATIENT,
      PERMISSIONS.DELETE_PATIENT,
    ],
  },
  {
    labelKey: "staff.permissions.groups.staff",
    permissions: [
      PERMISSIONS.VIEW_STAFF,
      PERMISSIONS.INVITE_STAFF,
      PERMISSIONS.MANAGE_STAFF_STATUS,
    ],
  },
  {
    labelKey: "staff.permissions.groups.branches",
    permissions: [PERMISSIONS.VIEW_BRANCHES, PERMISSIONS.MANAGE_BRANCHES],
  },
  {
    labelKey: "staff.permissions.groups.schedule",
    permissions: [PERMISSIONS.MANAGE_SCHEDULE, PERMISSIONS.MANAGE_VISIT_TYPES],
  },
  {
    labelKey: "staff.permissions.groups.appointments",
    permissions: [
      PERMISSIONS.VIEW_APPOINTMENTS,
      PERMISSIONS.MANAGE_APPOINTMENTS,
    ],
  },
  {
    labelKey: "staff.permissions.groups.invoices",
    permissions: [PERMISSIONS.VIEW_INVOICES, PERMISSIONS.MANAGE_INVOICES],
  },
];

interface PermissionsTabProps {
  staffId: string;
}

export function PermissionsTab({ staffId }: PermissionsTabProps) {
  const { t } = useTranslation();
  const { data: current = [], isLoading } = useGetPermissions(staffId);
  const { mutate: setPermissions, isPending } = useSetPermissions(staffId);

  const toggle = (permission: Permission) => {
    const next = current.includes(permission)
      ? current.filter((p) => p !== permission)
      : [...current, permission];
    setPermissions(next);
  };

  if (isLoading) {
    return (
      <div className="text-muted py-8 text-center text-sm">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5 py-2">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.labelKey} className="flex flex-col gap-2">
          <p className="text-muted text-xs font-semibold tracking-wide uppercase">
            {t(group.labelKey)}
          </p>
          <div className="grid grid-cols-2 gap-2">
            {group.permissions.map((permission) => (
              <Checkbox
                key={permission}
                isSelected={current.includes(permission)}
                onPress={() => toggle(permission)}
                isDisabled={isPending}
              >
                {t(`staff.permissions.${permission}`, {
                  defaultValue: permission,
                })}
              </Checkbox>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
