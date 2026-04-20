import { PERMISSIONS, type Permission } from "@/core/constants";
import { Chip } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useGetPermissions, useSetPermissions } from "../staffHooks";

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
      <div className="text-muted py-6 text-center text-sm">
        {t("common.loading")}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4 py-1">
      {PERMISSION_GROUPS.map((group) => (
        <div key={group.labelKey}>
          <p className="text-muted mb-2 text-xs font-semibold tracking-wide uppercase">
            {t(group.labelKey)}
          </p>
          <div className="flex flex-wrap gap-2">
            {group.permissions.map((permission) => {
              const active = current.includes(permission);
              return (
                <Chip
                  key={permission}
                  variant={active ? "primary" : "tertiary"}
                  color={active ? "accent" : "default"}
                  className={`cursor-pointer transition-opacity select-none ${isPending ? "pointer-events-none opacity-50" : ""}`}
                  onClick={() => toggle(permission)}
                >
                  {t(`staff.permissions.${permission}`, {
                    defaultValue: permission,
                  })}
                </Chip>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}


