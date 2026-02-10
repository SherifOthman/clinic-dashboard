import { Button } from "@heroui/button";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

/**
 * Reusable theme switch component
 * Provides consistent theme switching across the application
 */
export function ThemeSwitch() {
  const [theme, setThemeState] = useState<"light" | "dark">("dark");

  useEffect(() => {
    // Get initial theme
    const savedTheme = localStorage.getItem("theme") as "light" | "dark" | null;
    const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
      .matches
      ? "dark"
      : "light";
    const initialTheme = savedTheme || systemTheme;

    setThemeState(initialTheme);

    // Apply theme to document immediately
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(initialTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setThemeState(newTheme);
    localStorage.setItem("theme", newTheme);

    // Apply theme to document
    document.documentElement.classList.remove("light", "dark");
    document.documentElement.classList.add(newTheme);

    // Trigger a custom event to notify other components
    window.dispatchEvent(new CustomEvent("theme-change", { detail: newTheme }));
  };

  return (
    <Button isIconOnly size="sm" variant="light" onPress={toggleTheme}>
      <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
      <span className="sr-only">Toggle theme</span>
    </Button>
  );
}
