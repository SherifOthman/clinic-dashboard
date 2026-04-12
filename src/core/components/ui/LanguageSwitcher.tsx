import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onPress={handleLanguageToggle}
      className="min-w-12"
    >
      {i18n.language === "ar" ? "EN" : "عربي"}
    </Button>
  );
}
