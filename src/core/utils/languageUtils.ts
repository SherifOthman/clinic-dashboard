/**
 * Language utilities for managing DOM language settings
 */

export const applyLanguageSettings = (language: string): void => {
  const htmlElement = document.documentElement;

  if (language === "ar") {
    htmlElement.dir = "rtl";
    htmlElement.lang = "ar";
    document.body.style.fontFamily = "var(--font-arabic)";
  } else {
    htmlElement.dir = "ltr";
    htmlElement.lang = "en";
    document.body.style.fontFamily = "var(--font-english)";
  }

  htmlElement.style.setProperty("--current-lang", language);
};

export const initializeLanguage = (): void => {
  const storedLanguage = localStorage.getItem("i18nextLng") || "en";
  applyLanguageSettings(storedLanguage);
};
