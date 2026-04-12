import { Avatar, Dropdown, Label, Separator } from "@heroui/react";
import { useQueryClient } from "@tanstack/react-query";
import { LogOut, Settings, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { tokenManager } from "@/core/api";
import { getFileUrl } from "@/core/utils/fileUtils";
import { getGenderImageSrc } from "@/core/utils/patientImageUtils";
import { authApi } from "@/features/auth/api/authApi";
import { useMe } from "@/features/auth/hooks";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function UserAvatar({ size = "md", className }: UserAvatarProps) {
  const { user } = useMe();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const handleLogout = async () => {
    try {
      await authApi.logout();
    } catch {
      // Ignore errors
    } finally {
      tokenManager.clearTokens();
      queryClient.clear();
      navigate("/login", { replace: true });
    }
  };

  const handleAction = (key: React.Key) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        handleLogout();
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
    ? getFileUrl(user.profileImageUrl)
    : getGenderImageSrc(user.gender);

  const initials = `${user.firstName[0]}${user.lastName[0]}`;

  return (
    <Dropdown>
      <Dropdown.Trigger className={className}>
        <Avatar size={size}>
          <Avatar.Image
            className="object-cover"
            src={avatarSrc}
            alt={`${user.firstName} ${user.lastName}`}
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
                <span className="font-semibold">
                  {user.firstName} {user.lastName}
                </span>
                <span className="text-default-500 text-sm">{user.email}</span>
              </div>
            </Dropdown.Item>
          </Dropdown.Section>

          <Separator />

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
