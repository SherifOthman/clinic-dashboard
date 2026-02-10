import { Card, CardBody } from "@heroui/card";
import { useTranslation } from "react-i18next";

export function WelcomeCard() {
  const { t } = useTranslation();

  return (
    <Card>
      <CardBody className="p-8">
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🏥</div>
          <h2 className="text-xl font-semibold mb-2">
            {t("dashboard.comingSoon")}
          </h2>
          <p className="text-default-600">
            {t("dashboard.featuresImplemented")}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}
