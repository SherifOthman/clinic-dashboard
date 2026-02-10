import { ToastProvider } from "@heroui/toast";
import { useTranslation } from "react-i18next";

interface ToastProviderWrapperProps {
  children: React.ReactNode;
}

export function ToastProviderWrapper({ children }: ToastProviderWrapperProps) {
  const { i18n } = useTranslation();

  // Set toast placement based on language direction
  const toastPlacement = i18n.language === "ar" ? "top-left" : "top-right";

  return (
    <>
      <ToastProvider placement={toastPlacement} maxVisibleToasts={3} />
      {children}
    </>
  );
}
