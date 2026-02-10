import { useTranslation } from "react-i18next";

export function ProfileHeader() {
  const { t } = useTranslation();

  return (
    <div>
      <h1 className="text-2xl font-bold">{t("profile.title")}</h1>
      <p className="text-default-600">{t("profile.subtitle")}</p>
    </div>
  );
}
