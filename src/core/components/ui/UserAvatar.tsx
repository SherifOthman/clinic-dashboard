import { Avatar, Dropdown, Label, Separator } from "@heroui/react";
import { LogOut, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";

import { getFileUrl } from "@/core/utils/fileUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import { useLogout, useMe } from "@/features/auth/hooks";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ size = "md", className }: UserAvatarProps) {
  const { user } = useMe();
  const { t } = useTranslation();
  const { mutate: logout } = useLogout();

  const handleAction = (key: React.Key) => {
    switch (key) {
      case "profile":
        window.location.href = "/profile";
        break;
      case "logout":
        logout();
        break;
    }
  };

  if (!user) {
    return (
      <Avatar size={size} className={className}>
        <Avatar.Fallback>
          <User className="h-4 w-4" />
        </Avatar.Fallback>
      </Avatar>
    );
  }

  const avatarSrc = user.profileImageUrl
    ? (user.profileImageUrl.startsWith("http://") || user.profileImageUrl.startsWith("https://")
        ? user.profileImageUrl          // already a full URL (e.g. Google profile picture)
        : getFileUrl(user.profileImageUrl))  // relative path — prepend API base
    : getGenderImageSrc(user.gender);

  const initials = user.fullName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <Dropdown>
      <Dropdown.Trigger className={className}>
        <Avatar size={size}>
          <Avatar.Image
            className="object-cover"
            src={avatarSrc}
            alt={user.fullName}
          />
          <Avatar.Fallback>{initials}</Avatar.Fallback>
        </Avatar>
      </Dropdown.Trigger>
      <Dropdown.Popover placement="bottom end">
        <Dropdown.Menu onAction={handleAction}>
          {/* User Info Section */}
          <Dropdown.Section>
            <Dropdown.Item id="user-info" textValue="User info">
              <div className="flex flex-col">
                <span className="font-semibold">{user.fullName}</span>
                <span className="text-default-500 text-sm">{user.email}</span>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>

          <Separator variant="default" />

          {/* Actions Section */}
          <Dropdown.Section>
            <Dropdown.Item id="profile" textValue="Profile settings">
              <Settings className="mr-2 h-4 w-4" />
              <Label>{t("userMenu.profileSettings")}</Label>
            </Dropdown.Item>
            <Dropdown.Item id="logout" textValue="Logout" variant="danger">
              <LogOut className="mr-2 h-4 w-4" />
              <Label>{t("userMenu.logout")}</Label>
            </Dropdown.Item>
          </Dropdown.Section>
        </Dropdown.Menu>
      </Dropdown.Popover>
    </Dropdown>
  );
}
