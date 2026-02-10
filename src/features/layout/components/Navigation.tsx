import { RouterLink } from "@/core/components/ui/RouterLink";
import { cn } from "@/core/utils/cn";
import { useLocation } from "react-router-dom";

interface NavigationItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

interface NavigationProps {
  items: NavigationItem[];
  collapsed?: boolean;
  onItemClick?: () => void;
}

export function Navigation({
  items,
  collapsed = false,
  onItemClick,
}: NavigationProps) {
  const location = useLocation();

  return (
    <nav className="p-2 space-y-1">
      {items.map((item) => {
        const IconComponent = item.icon;
        const isActive = location.pathname === item.href;

        return (
          <RouterLink
            key={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors no-underline",
              collapsed ? "justify-center" : "",
              isActive
                ? "bg-primary/10 text-primary border-r-2 border-primary"
                : "text-default-600 hover:text-primary hover:bg-default-100",
            )}
            to={item.href}
            onPress={onItemClick}
          >
            <IconComponent className="w-5 h-5" />
            {!collapsed && <span>{item.label}</span>}
          </RouterLink>
        );
      })}
    </nav>
  );
}
