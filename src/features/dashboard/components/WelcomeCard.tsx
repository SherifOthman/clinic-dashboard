import { Card } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <Card.Content>
        <div className="mb-4 text-6xl">🏥</div>
        <h2 className="mb-2 text-2xl font-semibold">
          {t("dashboard.comingSoon")}
        </h2>
        <p className="text-default-600">{t("dashboard.featuresImplemented")}</p>
      </Card.Content>
    </Card>
  );
}
