import { Tooltip } from "@heroui/tooltip";
import { useTranslation } from "react-i18next";

import { siteConfig } from "@/core/config/site";
import { Navigation } from "./Navigation";
import { SidebarHeader } from "./SidebarHeader";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLinkClick: () => void;
}

// Map navigation keys to translation keys
const navigationTranslationMap: Record<string, string> = {
  dashboard: "navigation.dashboard",
  patients: "navigation.patients",
  profile: "navigation.profile",
};

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onLinkClick,
}: SidebarProps) {
  const { t } = useTranslation();

  // Translate navigation items
  const getTranslatedItems = (items: readonly any[]) => {
    return items.map((item) => ({
      ...item,
      label: navigationTranslationMap[item.key]
        ? t(navigationTranslationMap[item.key])
        : item.label,
    }));
  };

  // Use only regular navigation items
  const navigationItems = getTranslatedItems(siteConfig.sidebarItems);

  return (
    <>
      <SidebarHeader
        collapsed={collapsed}
        onToggleCollapse={onToggleCollapse}
      />

      {collapsed ? (
        <div className="p-2 space-y-1">
          {navigationItems.map((item) => (
            <Tooltip key={item.href} content={item.label} placement="right">
              <div className="flex justify-center">
                <Navigation
                  items={[item]}
                  collapsed={collapsed}
                  onItemClick={onLinkClick}
                />
              </div>
            </Tooltip>
          ))}
        </div>
      ) : (
        <Navigation
          items={navigationItems}
          collapsed={collapsed}
          onItemClick={onLinkClick}
        />
      )}
    </>
  );
}
