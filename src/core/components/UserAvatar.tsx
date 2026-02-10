import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { LogOut, Settings, User as UserIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useAuth } from "@/features/auth/hooks/useAuth";

interface UserAvatarProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

// Get the base URL for static files from the API URL
const getStaticFileUrl = (path: string) => {
  const apiUrl = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
  const baseUrl = apiUrl.replace("/api", "");
  return `${baseUrl}${path}`;
};

/**
 * User avatar with dropdown menu
 * Displays user avatar with dropdown for profile and logout
 */
export function UserAvatar({ size = "md", className }: UserAvatarProps) {
  const { user, logout } = useAuth();
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getInitials = () => {
    if (!user) return "U";
    const first = user.firstName?.[0] || "";
    const last = user.lastName?.[0] || "";
    const initials = (first + last).toUpperCase();
    return initials || "U"; // Fallback to "U" if no initials
  };

  const getAvatarSrc = () => {
    // Use profileImageUrl with full URL and cache busting
    if (user?.profileImageUrl) {
      return `${getStaticFileUrl(user.profileImageUrl)}?t=${user.profileImageUpdatedAt || Date.now()}`;
    }
    return undefined; // Return undefined to force showing initials
  };

  const handleAction = (key: string) => {
    switch (key) {
      case "profile":
        navigate("/profile");
        break;
      case "logout":
        logout();
        break;
    }
  };

  if (!user) {
    return (
      <Avatar
        fallback={<UserIcon className="w-4 h-4" />}
        size={size}
        className={className}
      />
    );
  }

  const initials = getInitials();
  const avatarSrc = getAvatarSrc();

  return (
    <Dropdown placement="bottom-end">
      <DropdownTrigger>
        <Button variant="light" className="p-0 min-w-0 h-auto bg-transparent">
          <Avatar
            key={avatarSrc} // Force re-render when URL changes
            src={avatarSrc}
            name={initials}
            size={size}
            className={className}
            color="primary"
            radius="full"
          />
        </Button>
      </DropdownTrigger>
      <DropdownMenu
        aria-label={t("userMenu.userMenu")}
        onAction={(key) => handleAction(key as string)}
      >
        <DropdownItem
          key="user-info"
          className="h-14 gap-2"
          textValue={t("userMenu.userInfo")}
        >
          <div className="flex flex-col">
            <p className="font-semibold">
              {user.firstName} {user.lastName}
            </p>
            <p className="text-sm text-default-500">{user.email}</p>
          </div>
        </DropdownItem>
        <DropdownItem
          key="profile"
          startContent={<Settings className="w-4 h-4" />}
        >
          {t("userMenu.profileSettings")}
        </DropdownItem>
        <DropdownItem
          key="logout"
          color="danger"
          startContent={<LogOut className="w-4 h-4" />}
        >
          {t("userMenu.logout")}
        </DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
