import { Outlet, useLocation } from "react-router-dom";

import { LanguageSwitcher } from "@/core/components/ui/LanguageSwitcher";
import { ThemeSwitch } from "@/core/components/ui/ThemeSwitch";
import { cn } from "@/core/utils";

export function AuthLayout() {
  const location = useLocation();
  const isOnboarding = location.pathname === "/onboarding";

  return (
    <div className="from-background to-default-100 relative flex min-h-screen items-center justify-center bg-gradient-to-br p-4">
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      <div className={cn("w-full", isOnboarding ? "max-w-3xl" : "max-w-md")}>
        <Outlet />
      </div>
    </div>
  );
}

