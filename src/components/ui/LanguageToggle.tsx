import { Button } from "@heroui/button";
import { Languages } from "lucide-react";
import { useState } from "react";

export function LanguageToggle() {
  const [language, setLanguage] = useState("en");

  const toggleLanguage = () => {
    setLanguage(language === "en" ? "ar" : "en");
  };

  return (
    <Button
      isIconOnly
      variant="light"
      className="text-default-600 hover:bg-default-100"
      onPress={toggleLanguage}
      title={language === "en" ? "Switch to Arabic" : "Switch to English"}
    >
      <div className="flex items-center gap-1">
        <Languages size={18} />
        <span className="text-xs font-medium">{language.toUpperCase()}</span>
      </div>
    </Button>
  );
}
