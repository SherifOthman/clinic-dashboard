import { Button, Separator, Tooltip } from "@heroui/react";
import { Menu } from "lucide-react";
import { useTranslation } from "react-i18next";
import { NavLink } from "react-router-dom";

import { siteConfig } from "@/core/config";
import { canAccessRouteWithPermissions } from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { useContactMessagesUnreadCount } from "@/features/dashboard/dashboardHooks";
import { isSuperAdmin } from "@/core/utils/permissions";

interface SidebarProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
  onLinkClick: () => void;
}

function navLinkClass(isActive: boolean, collapsed: boolean): string {
  const base = "relative flex items-center gap-3 rounded-lg px-3 py-2 transition-colors";
  const layout = collapsed ? "justify-center" : "";
  const state = isActive
    ? "bg-surface-tertiary text-foreground font-semibold"
    : "text-muted hover:bg-surface-secondary hover:text-foreground";
  return [base, layout, state].filter(Boolean).join(" ");
}

export function Sidebar({ collapsed, onToggleCollapse, onLinkClick }: SidebarProps) {
  const { t } = useTranslation();
  const { user } = useMe();
  const { data: unreadMessages = 0 } = useContactMessagesUnreadCount();

  // Only SuperAdmin sees the messages badge
  const showMessagesBadge = isSuperAdmin(user) && unreadMessages > 0;

  const navigationItems = siteConfig.sidebarItems
    .filter((item) =>
      canAccessRouteWithPermissions(user, item.href, item.requiredPermission),
    )
    .map((item) => ({
      ...item,
      label: t(`navigation.${item.key}`),
    }));

  return (
    <div className="flex h-full flex-col">
      {/* Brand header */}
      <div
        className={`flex min-h-16 items-center px-4 ${
          collapsed ? "justify-center" : "justify-between"
        }`}
      >
        {!collapsed && (
          <div className="flex items-center gap-2">
            <img src="/logo.svg" alt="ClinicCare" className="h-7 w-7" />
            <h1 className="text-lg font-bold">ClinicCare</h1>
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

      {/* Navigation */}
      <nav className="flex-1 overflow-auto px-2 py-2">
        <ul className="flex flex-col gap-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;

            const link = (
              <NavLink
                to={item.href}
                onClick={onLinkClick}
                className={({ isActive }) => navLinkClass(isActive, collapsed)}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="text-sm font-medium">{item.label}</span>
                )}
                {/* Unread badge for Messages */}
                {item.key === "messages" && showMessagesBadge && (
                  collapsed ? (
                    <span className="absolute top-1 end-1 h-2 w-2 rounded-full bg-warning" />
                  ) : (
                    <span className="ms-auto flex h-5 min-w-5 items-center justify-center rounded-full bg-warning/15 px-1 text-[10px] font-bold text-warning">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )
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
