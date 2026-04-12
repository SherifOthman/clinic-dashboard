import { Card } from "@heroui/react";
import { Clock } from "lucide-react";
import { useTranslation } from "react-i18next";

export function ReceptionistDashboard() {
  const { t } = useTranslation();

  return (
    <Card className="p-12 text-center">
      <div className="flex flex-col items-center gap-4">
        <div className="bg-default-100 flex h-16 w-16 items-center justify-center rounded-full">
          <Clock className="text-default-400 h-8 w-8" />
        </div>
        <h2 className="text-xl font-semibold">{t("common.comingSoon")}</h2>
        <p className="text-default-500 max-w-sm text-sm">
          {t("dashboard.receptionistComingSoon")}
        </p>
      </div>
    </Card>
  );
}

