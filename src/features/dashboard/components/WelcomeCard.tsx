import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <div className="text-6xl mb-4">🏥</div>
      <h2 className="text-2xl font-semibold mb-2">
        {t("dashboard.comingSoon")}
      </h2>
      <p className="text-default-600">{t("dashboard.featuresImplemented")}</p>
    </Card>
  );
}

