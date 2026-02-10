import { useTranslation } from "react-i18next";

interface MobileOverlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function MobileOverlay({ isOpen, onClose }: MobileOverlayProps) {
  const { t } = useTranslation();

  if (!isOpen) return null;

  return (
    <button
      aria-label={t("navigation.closeMobileMenu")}
      className="fixed inset-0 bg-black/50 z-40 lg:hidden cursor-pointer"
      onClick={onClose}
      onKeyDown={(e) => {
        if (e.key === "Escape") {
          onClose();
        }
      }}
    />
  );
}
