import { Button } from "@heroui/button";
import { Menu, Triangle } from "lucide-react";

interface SidebarHeaderProps {
  collapsed: boolean;
  onToggleCollapse: () => void;
}

export function SidebarHeader({
  collapsed,
  onToggleCollapse,
}: SidebarHeaderProps) {
  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-divider h-[60px]">
      {!collapsed && (
        <div className="flex items-center gap-2">
          <Triangle className="w-6 h-6 text-primary" />
          <span className="font-bold text-lg">Dashboard</span>
        </div>
      )}
      {/* Desktop collapse button - hidden on mobile */}
      <Button
        isIconOnly
        className="hidden lg:flex"
        size="sm"
        variant="light"
        onPress={onToggleCollapse}
      >
        <Menu className="w-5 h-5" />
      </Button>
    </div>
  );
}
