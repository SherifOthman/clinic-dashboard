import { Sidebar } from "@/core/components/ui/Sidebar";
import { useIsMobile } from "@/core/hooks/useIsMobile";
import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { Drawer } from "@heroui/react";
import { useState } from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";

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
          className="border-divider bg-surface shrink-0 overflow-auto border-e transition-all duration-300"
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
      <div className="flex flex-1 flex-col overflow-hidden">
        <DashboardHeader
          isMobile={isMobile}
          onMenuToggle={() => setMobileMenuOpen((open) => !open)}
        />

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
