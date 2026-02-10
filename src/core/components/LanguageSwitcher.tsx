import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const handleLanguageToggle = () => {
    const newLanguage = i18n.language === "en" ? "ar" : "en";
    i18n.changeLanguage(newLanguage);
    // The languageChanged event in i18n/index.ts will handle DOM updates
  };

  const isArabic = i18n.language === "ar";

  return (
    <Button
      variant="light"
      size="sm"
      onPress={handleLanguageToggle}
      className="min-w-0 px-3"
    >
      <span className="text-sm font-medium">{isArabic ? "EN" : "عر"}</span>
    </Button>
  );
};
