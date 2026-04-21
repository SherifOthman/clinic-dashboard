import { Button, Separator, Tooltip } from "@heroui/react";
import { Menu, Triangle } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { siteConfig } from "@/core/config";
import { canAccessRoute } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLinkClick: () => void;
}

export function Sidebar({
  collapsed,
  onToggleCollapse,
  onLinkClick,
}: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useMe();

  const navigationItems = siteConfig.sidebarItems
    .filter((item) => canAccessRoute(user, item.href))
    .map((item) => ({
      ...item,
      label: t(`navigation.${item.key}`),
    }));

  return (
    <div className="flex h-full flex-col">
      {/* Header */}
      <div
        className={`flex min-h-16 items-center px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <Triangle className="text-accent fill-accent h-5 w-5" />
            <h1 className="text-lg font-bold">{t("navigation.dashboard")}</h1>
          </div>
        )}
        <Button
          variant="ghost"
          size="sm"
          isIconOnly
          onPress={onToggleCollapse}
          className="hidden lg:flex"
        >
          <Menu className="h-4 w-4" />
        </Button>
      </div>

      <Separator />

      {/* Navigation Items */}
      <nav className="flex-1 overflow-auto px-2 py-2">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;

            const link = (
              <NavLink
                to={item.href}
                onClick={onLinkClick}
                className={({ isActive }) =>
                  `flex items-center gap-3 rounded-lg px-3 py-2 transition-colors ${
                    collapsed ? "justify-center" : ""
                  } ${
                    isActive
                      ? "bg-surface-tertiary text-foreground font-semibold"
                      : "text-muted hover:bg-surface-secondary hover:text-foreground"
                  }`
                }
              >
                <IconComponent className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
              </NavLink>
            );

            return (
              <li key={item.href}>
                {collapsed ? (
                  <Tooltip delay={300}>
                    <Tooltip.Trigger>{link}</Tooltip.Trigger>
                    <Tooltip.Content placement="right">
                      <p>{item.label}</p>
                    </Tooltip.Content>
                  </Tooltip>
                ) : (
                  link
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
