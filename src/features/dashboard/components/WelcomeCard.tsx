import { Card, Typography } from "@heroui/react";
import { useTranslation } from "react-i18next";

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <Card.Content>
        <div className="mb-4 text-6xl">🏥</div>
        <Typography type="h2" weight="semibold" className="mb-2 text-2xl">
          {t("dashboard.comingSoon")}
        </Typography>
        <p className="text-muted">{t("dashboard.featuresImplemented")}</p>
      </Card.Content>
    </Card>
  );
}
