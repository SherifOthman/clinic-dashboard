import { Outlet } from "react-router-dom";

import { LanguageSwitcher } from "@/core/components/LanguageSwitcher";
import { ThemeSwitch } from "@/core/components/ThemeSwitch";

export function AuthLayout() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-default-100 p-4 relative">
      {/* Theme Switch and Language Switcher - Top Right */}
      <div className="absolute top-4 right-4 flex items-center gap-2">
        <LanguageSwitcher />
        <ThemeSwitch />
      </div>

      {/* Auth Content */}
      <div className="w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}
