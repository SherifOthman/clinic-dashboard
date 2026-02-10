import { logger } from "@/core/services/logger";

/**
 * Initialize theme settings on app start
 */
export const initializeTheme = (): void => {
  const savedTheme = localStorage.getItem("theme");
  const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
  const theme = savedTheme || systemTheme;

  document.documentElement.classList.remove("light", "dark");
  document.documentElement.classList.add(theme);

  logger.info("Theme initialized", { theme, savedTheme, systemTheme }, "App");
};
