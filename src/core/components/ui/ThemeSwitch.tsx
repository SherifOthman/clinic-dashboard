import { Button } from "@heroui/react";
import { Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";

export function ThemeSwitch() {
  const { theme, setTheme } = useTheme();

  return (
    <Button
      size="sm"
      variant="ghost"
      onPress={() => setTheme(theme === "dark" ? "light" : "dark")}
      aria-label="Toggle theme"
      isIconOnly
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" />
      ) : (
        <Moon className="h-4 w-4" />
      )}
    </Button>
  );
}
