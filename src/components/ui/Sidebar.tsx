import { Tooltip } from "@heroui/tooltip";
import { LucideIcon } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

export interface SidebarItem {
  icon: LucideIcon;
  label: string;
  path: string;
}

interface SidebarProps {
  items: SidebarItem[];
  isOpen: boolean;
  logo?: string;
  logoCollapsed?: React.ReactNode;
  onItemClick?: () => void;
}

export function Sidebar({
  items,
  isOpen,
  logo = "App",
  logoCollapsed,
  onItemClick,
}: SidebarProps) {
  const location = useLocation();

  return (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-16 items-center justify-center px-3 border-b border-divider">
        {isOpen ? (
          <h1 className="text-xl font-bold text-primary">{logo}</h1>
        ) : (
          logoCollapsed || (
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center">
              <span className="text-white font-bold text-lg">{logo[0]}</span>
            </div>
          )
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-2 py-4">
        <ul className="space-y-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <li key={item.path}>
                {isOpen ? (
                  <Link
                    className={`flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-primary text-primary-foreground"
                        : "text-default-700 hover:bg-default-100"
                    }`}
                    to={item.path}
                    onClick={onItemClick}
                  >
                    <Icon size={20} />
                    {item.label}
                  </Link>
                ) : (
                  <Tooltip content={item.label} placement="right">
                    <Link
                      className={`flex items-center justify-center rounded-lg p-2.5 text-sm font-medium transition-colors ${
                        isActive
                          ? "bg-primary text-primary-foreground"
                          : "text-default-700 hover:bg-default-100"
                      }`}
                      to={item.path}
                      onClick={onItemClick}
                    >
                      <Icon size={20} />
                    </Link>
                  </Tooltip>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
