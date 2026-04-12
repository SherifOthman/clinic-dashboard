import { useLocalStorage } from "@/core/hooks/useLocalStorage";
import { createContext, useContext } from "react";

type ThemeMode = "light" | "dark";

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

// Read the OS preference on first load so the default matches the user's system.
// This runs once at module evaluation time (before any React render).
function getInitialTheme(): ThemeMode {
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
}

export function ThemeContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Persist the chosen theme in localStorage so it survives page refreshes.
  const [mode, setMode] = useLocalStorage<ThemeMode>(
    "theme",
    getInitialTheme(),
  );

  const toggleTheme = () => {
    setMode((prev) => (prev === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

// Convenience hook — throws if used outside the provider so bugs are caught early.
export function useThemeMode() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useThemeMode must be used within ThemeContextProvider");
  }
  return context;
}
