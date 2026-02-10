import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";

import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { cn } from "@/core/utils/cn";
import { Header } from "@/features/layout/components/Header";
import { MobileOverlay } from "@/features/layout/components/MobileOverlay";
import { Sidebar } from "@/features/layout/components/Sidebar";

export function DefaultLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useLocalStorage(
    "sidebarCollapsed",
    false,
  );

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleThemeChange = () => {
      document.documentElement.setAttribute("data-theme-transition", "false");
      setTimeout(() => {
        document.documentElement.removeAttribute("data-theme-transition");
      }, 100);
    };

    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (
          mutation.type === "attributes" &&
          mutation.attributeName === "class"
        ) {
          handleThemeChange();
        }
      });
    });

    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => observer.disconnect();
  }, []);

  const handleLinkClick = () => {
    setMobileMenuOpen(false);
  };

  const handleToggleCollapse = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleMobileMenuClose = () => {
    setMobileMenuOpen(false);
  };

  return (
    <div className="flex h-screen bg-background">
      <MobileOverlay isOpen={mobileMenuOpen} onClose={handleMobileMenuClose} />

      <aside
        className={cn(
          "fixed top-0 z-50 h-full bg-content1 border-divider transition-all duration-300",
          "left-0 border-r rtl:left-auto rtl:right-0 rtl:border-r-0 rtl:border-l",
          "lg:block lg:translate-x-0",
          sidebarCollapsed ? "lg:w-16" : "lg:w-64",
          "w-64",
          mobileMenuOpen
            ? "block translate-x-0"
            : "hidden lg:block -translate-x-full lg:translate-x-0 rtl:translate-x-full rtl:lg:translate-x-0",
        )}
      >
        <Sidebar
          collapsed={sidebarCollapsed}
          onLinkClick={handleLinkClick}
          onToggleCollapse={handleToggleCollapse}
        />
      </aside>

      <div
        className={cn(
          "flex-1 flex flex-col transition-all duration-300",
          "lg:ml-0 rtl:lg:ml-0 rtl:lg:mr-0",
          sidebarCollapsed
            ? "lg:ml-16 rtl:lg:ml-0 rtl:lg:mr-16"
            : "lg:ml-64 rtl:lg:ml-0 rtl:lg:mr-64",
          "ml-0 mr-0",
        )}
      >
        <Header onMobileMenuToggle={handleMobileMenuToggle} />

        <main className="flex-1 overflow-auto p-3 lg:p-4">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
