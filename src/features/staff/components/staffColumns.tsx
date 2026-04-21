import type { Column } from "@/core/components/ui/DataTable";
import { getFileUrl } from "@/core/utils/fileUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import { canToggleStaffStatus } from "@/core/utils/permissions";
import type { User } from "@/features/auth/types";
import { Avatar, Button, Chip } from "@heroui/react";
import type { TFunction } from "i18next";
import type { StaffDto } from "../types";
import { ROLE_COLORS } from "./roleColors";

interface StaffColumnsOptions {
  t: TFunction;
  isRTL: boolean;
  formatDate: (date: string) => string;
  currentUser: User | null | undefined;
  onToggleActive: (staff: StaffDto) => void;
  pendingId?: string;
}

export function getStaffColumns({
  t,
  formatDate,
  currentUser,
  onToggleActive,
  pendingId,
}: StaffColumnsOptions): Column<StaffDto>[] {
  const canToggle = canToggleStaffStatus(currentUser);
  return [
    // 1. Name + avatar (most important)
    {
      key: "fullName",
      label: t("common.fields.name"),
      sortable: true,
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar size="sm">
            <Avatar.Image
              className="object-cover"
              src={
                item.profileImageUrl
                  ? getFileUrl(item.profileImageUrl)
                  : getGenderImageSrc(item.gender)
              }
              alt={item.fullName}
            />
            <Avatar.Fallback>
              {item.fullName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </Avatar.Fallback>
          </Avatar>
          <span className="font-medium">{item.fullName}</span>
        </div>
      ),
    },
    // 2. Role (important — defines permissions)
    {
      key: "roles",
      label: t("common.fields.role"),
      render: (item) => (
        <div className="flex flex-wrap gap-1">
          {item.roles.map((r) => (
            <Chip
              key={r.name}
              size="sm"
              variant="soft"
              color={ROLE_COLORS[r.name] ?? "default"}
            >
              {t(`staff.roles.${r.name}`, { defaultValue: r.name })}
            </Chip>
          ))}
        </div>
      ),
    },
    // 3. Status
    {
      key: "isActive",
      label: t("common.fields.status"),
      render: (item) => (
        <Chip
          size="sm"
          variant="soft"
          color={item.isActive ? "success" : "danger"}
        >
          {item.isActive
            ? t("common.status.active")
            : t("common.status.inactive")}
        </Chip>
      ),
    },
    // 4. Gender (secondary)
    {
      key: "gender",
      label: t("common.fields.gender"),
      render: (item) => (
        <span className="text-muted text-sm">
          {item.gender === "Male"
            ? t("common.fields.male")
            : t("common.fields.female")}
        </span>
      ),
    },
    // 5. Join date (least important)
    {
      key: "joinDate",
      label: t("staff.joinDate"),
      sortable: true,
      render: (item) => (
        <span dir="ltr" className="text-muted text-sm">
          {formatDate(item.joinDate)}
        </span>
      ),
    },
    // 6. Actions
    {
      key: "actions",
      label: t("common.actions"),
      render: (item) =>
        canToggle ? (
          <div role="none" onClick={(e) => e.stopPropagation()}>
            <Button
              size="sm"
              variant={item.isActive ? "danger-soft" : "primary"}
              isPending={pendingId === item.id}
              isDisabled={!!pendingId}
              onPress={() => onToggleActive(item)}
            >
              {item.isActive
                ? t("common.status.deactivate")
                : t("common.status.activate")}
            </Button>
          </div>
        ) : null,
    },
  ];
}
