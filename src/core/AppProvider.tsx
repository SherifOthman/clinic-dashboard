import { Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { ThemeContextProvider, useThemeMode } from "./ThemeContext";

// Single QueryClient instance shared across the whole app.
// staleTime: 5 min — data is considered fresh for 5 minutes before a background refetch.
// retry: 1 — failed requests are retried once before showing an error.
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

// AppContent is a separate component so it can consume ThemeContext
// (which is provided by ThemeContextProvider above it in the tree).
function AppContent({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const { mode } = useThemeMode();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";

  // Sync theme class, text direction, and lang attribute on <html>.
  // This runs whenever the language or theme changes.
  useEffect(() => {
    const html = document.documentElement;

    // HeroUI v3 uses class-based theming: "light" or "dark" on <html>
    html.classList.remove("light", "dark");
    html.classList.add(mode);

    // Tailwind's RTL utilities (rtl:*) activate when dir="rtl" is on a parent
    html.setAttribute("dir", direction);

    // Accessibility + SEO: tells the browser the page language
    html.setAttribute("lang", i18n.language);
  }, [mode, direction, i18n.language]);

  return (
    <>
      {/* Toast.Provider must be rendered once at the app root.
          Placement flips to the start (right side in RTL) automatically. */}
      <Toast.Provider
        placement={direction === "rtl" ? "top start" : "top end"}
        maxVisibleToasts={3}
      />
      {children}
    </>
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContextProvider>
        <AppContent>{children}</AppContent>
      </ThemeContextProvider>
      {/* ReactQueryDevtools only loads in development builds */}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
