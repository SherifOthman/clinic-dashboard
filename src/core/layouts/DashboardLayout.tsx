import { LanguageSwitcher } from "@/core/components/ui/LanguageSwitcher";
import { Sidebar } from "@/core/components/ui/Sidebar";
import { ThemeSwitch } from "@/core/components/ui/ThemeSwitch";
import { UserAvatar } from "@/core/components/ui/UserAvatar";
import { useIsMobile } from "@/core/hooks/useIsMobile";
import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { Button, Drawer } from "@heroui/react";
import { Menu as MenuIcon } from "lucide-react";
import { useState } from "react";
import { Outlet } from "react-router-dom";

// Persisted so the sidebar state survives page refreshes
const SIDEBAR_WIDTH = 256;
const SIDEBAR_COLLAPSED_WIDTH = 64;

export function DashboardLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "sidebarCollapsed",
    false,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isMobile = useIsMobile();

  const sidebarWidth = sidebarCollapsed
    ? SIDEBAR_COLLAPSED_WIDTH
    : SIDEBAR_WIDTH;

  return (
    <div className="flex h-screen">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <div
          className="border-divider bg-surface shrink-0 overflow-auto border-r transition-all duration-300"
          style={{ width: sidebarWidth }}
        >
          <Sidebar
            collapsed={sidebarCollapsed}
            onLinkClick={() => {}}
            onToggleCollapse={() => setSidebarCollapsed(!sidebarCollapsed)}
          />
        </div>
      )}

      {/* Main Content */}
      <div className="flex flex-1 flex-col">
        {/* Header */}
        <header className="bg-surface border-divider border-b shadow-sm">
          <div className="flex h-16 items-center justify-between px-4">
            {isMobile && (
              <Button
                isIconOnly
                variant="ghost"
                onPress={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                <MenuIcon className="h-5 w-5" />
              </Button>
            )}
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <LanguageSwitcher />
              <ThemeSwitch />
              <UserAvatar />
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      {/* Mobile Sidebar — slide-in panel for small screens */}
      {isMobile && (
        <Drawer.Backdrop
          isOpen={mobileMenuOpen}
          onOpenChange={(open) => setMobileMenuOpen(open)}
        >
          <Drawer.Content placement="left">
            <Drawer.Dialog>
              <Drawer.CloseTrigger />
              <Drawer.Body className="p-0">
                <Sidebar
                  collapsed={false}
                  onLinkClick={() => setMobileMenuOpen(false)}
                  onToggleCollapse={() => {}}
                />
              </Drawer.Body>
            </Drawer.Dialog>
          </Drawer.Content>
        </Drawer.Backdrop>
      )}
    </div>
  );
}
