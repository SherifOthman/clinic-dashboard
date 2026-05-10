import { Card, Text } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <Card.Content>
        <div className="mb-4 text-6xl">🏥</div>
        <Text type="h2" weight="semibold" className="mb-2 text-2xl">
          {t("dashboard.comingSoon")}
        </Text>
        <p className="text-muted">{t("dashboard.featuresImplemented")}</p>
      </Card.Content>
    </Card>
  );
}
