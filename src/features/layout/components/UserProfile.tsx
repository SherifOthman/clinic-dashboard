import { useAuth } from "@/features/auth/hooks/useAuth";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/divider";
import { Tooltip } from "@heroui/tooltip";
import { LogOut } from "lucide-react";
import { useTranslation } from "react-i18next";

interface UserProfileProps {
  collapsed?: boolean;
}

export function UserProfile({ collapsed = false }: UserProfileProps) {
  const { t } = useTranslation();
  const { user, logout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    // Don't navigate here - logout function handles the redirect
  };

  return (
    <div className="absolute bottom-4 left-0 right-0 px-2">
      <Divider className="mb-4" />
      {collapsed ? (
        <div className="flex flex-col items-center gap-2">
          <Tooltip content={t("profile.userProfile")} placement="right">
            <div className="flex justify-center">
              <Avatar
                className="cursor-pointer"
                size="sm"
                src={`https://i.pravatar.cc/150?u=${user.email}`}
              />
            </div>
          </Tooltip>
          <Tooltip content={t("userMenu.logout")} placement="right">
            <Button
              isIconOnly
              color="danger"
              size="sm"
              variant="light"
              onPress={handleLogout}
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </Tooltip>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-default-100 cursor-pointer mb-2">
            <Avatar
              size="sm"
              src={`https://i.pravatar.cc/150?u=${user.email}`}
            />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-default-900 truncate">
                {`${user.firstName} ${user.lastName}`}
              </p>
              <p className="text-xs text-default-500 truncate">{user.email}</p>
            </div>
          </div>
          <Button
            className="w-full"
            color="danger"
            size="sm"
            startContent={<LogOut className="w-4 h-4" />}
            variant="light"
            onPress={handleLogout}
          >
            {t("userMenu.logout")}
          </Button>
        </>
      )}
    </div>
  );
}
