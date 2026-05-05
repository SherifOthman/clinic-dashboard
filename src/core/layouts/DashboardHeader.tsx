import { LanguageSwitcher } from "@/core/components/ui/LanguageSwitcher";
import { ThemeSwitch } from "@/core/components/ui/ThemeSwitch";
import { UserAvatar } from "@/core/components/ui/UserAvatar";
import { NotificationBell } from "@/features/notifications/NotificationBell";
import { Button } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";

interface DashboardHeaderProps {
  isMobile: boolean;
  onMenuToggle: () => void;
}

export function DashboardHeader({ isMobile, onMenuToggle }: DashboardHeaderProps) {
  return (
    <header className="bg-surface border-divider border-b shadow-sm">
      <div className="flex h-16 items-center justify-between px-4">
        {isMobile && (
          <Button isIconOnly variant="ghost" onPress={onMenuToggle}>
            <MenuIcon className="h-5 w-5" />
          </Button>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeSwitch />
          <NotificationBell />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
