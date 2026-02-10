import { Button } from "@heroui/button";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";

import { LanguageSwitcher } from "@/core/components/LanguageSwitcher";
import { ThemeSwitch } from "@/core/components/ThemeSwitch";
import { UserAvatar } from "@/core/components/UserAvatar";
import { siteConfig } from "@/core/config/site";

interface HeaderProps {
  onMobileMenuToggle: () => void;
}

// Map route paths to translation keys
const routeTranslationMap: Record<string, string> = {
  "/dashboard": "navigation.dashboard",
  "/patients": "navigation.patients",
  "/profile": "navigation.profile",
};

export function Header({ onMobileMenuToggle }: HeaderProps) {
  const { t } = useTranslation();
  const location = useLocation();

  const getPageTitle = () => {
    const translationKey = routeTranslationMap[location.pathname];
    if (translationKey) {
      return t(translationKey);
    }

    // Fallback to site config
    const sidebarItem = siteConfig.sidebarItems.find(
      (item) => item.href === location.pathname,
    );

    return sidebarItem?.label || t("navigation.dashboard");
  };

  return (
    <header className="sticky top-0 z-30 bg-content1 border-b border-divider px-4 lg:px-6 h-[60px] flex items-center">
      <div className="flex items-center justify-between w-full">
        <div className="flex items-center gap-4">
          {/* Mobile Menu Button */}
          <Button
            isIconOnly
            className="lg:hidden"
            size="sm"
            variant="light"
            onPress={onMobileMenuToggle}
          >
            <Menu className="w-5 h-5" />
          </Button>

          <h1 className="text-xl font-semibold text-default-900">
            {getPageTitle()}
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <LanguageSwitcher />
          <ThemeSwitch />
          <UserAvatar />
        </div>
      </div>
    </header>
  );
}
