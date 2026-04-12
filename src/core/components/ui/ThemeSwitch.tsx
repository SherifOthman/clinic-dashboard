import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";

import { useThemeMode } from "@/core/ThemeContext";

export function ThemeSwitch() {
  const { mode, toggleTheme } = useThemeMode();

  return (
    <Button
      size="sm"
      variant="ghost"
      onPress={toggleTheme}
      aria-label="Toggle theme"
      isIconOnly
    >
      {mode === "light" ? (
        <Moon className="h-4 w-4" />
      ) : (
        <Sun className="h-4 w-4" />
      )}
    </Button>
  );
}

