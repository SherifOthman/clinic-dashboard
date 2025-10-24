import { Switch } from "@heroui/switch";
import { useTheme } from "@heroui/use-theme";
import { Moon, Sun } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark");
  };

  return (
    <Switch
      isSelected={theme === "dark"}
      size="sm"
      thumbIcon={({ isSelected }) =>
        isSelected ? <Moon size={14} /> : <Sun size={14} />
      }
      onValueChange={toggleTheme}
    />
  );
}
