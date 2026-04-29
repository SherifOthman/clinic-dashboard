import { RouterProvider, Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ThemeProvider } from "next-themes";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      retry: 1,
    },
  },
});

function AppContent({ children }: { children: React.ReactNode }) {
  const { i18n } = useTranslation();
  const direction = i18n.language === "ar" ? "rtl" : "ltr";
  const navigate = useNavigate();

  // Sync text direction and lang attribute on <html>.
  // Theme (light/dark class + data-theme) is handled by next-themes ThemeProvider.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", direction);
    html.setAttribute("lang", i18n.language);
  }, [direction, i18n.language]);

  return (
    <RouterProvider navigate={navigate}>
      <ThemeProvider attribute={["class", "data-theme"]} defaultTheme="light" enableSystem>
        <Toast.Provider
          placement={direction === "rtl" ? "top start" : "top end"}
          maxVisibleToasts={3}
        />
        {children}
      </ThemeProvider>
    </RouterProvider>
  );
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent>{children}</AppContent>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
