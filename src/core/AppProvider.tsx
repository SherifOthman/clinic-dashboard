import { Toast } from "@heroui/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

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

  // Sync text direction and lang attribute on <html>.
  // Theme (light/dark class + data-theme) is handled by HeroUI's useTheme hook.
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("dir", direction);
    html.setAttribute("lang", i18n.language);
  }, [direction, i18n.language]);

  return (
    <>
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
      <AppContent>{children}</AppContent>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
