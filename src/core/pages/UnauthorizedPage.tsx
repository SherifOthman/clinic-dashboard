import { Button, Text } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <Text type="h1" weight="bold" className="text-danger mb-4 text-9xl">403</Text>
        <Text type="h2" weight="semibold" className="mb-2 text-3xl">
          {t("errors.accessDenied")}
        </Text>
        <Text type="body" color="muted" className="mb-8">{t("errors.noPermission")}</Text>
        <div className="flex justify-center gap-4">
          <Button
            type="button"
            size="sm"
            variant="outline"
            onPress={() => navigate("/dashboard")}
          >
            {t("errors.goToDashboard")}
          </Button>
          <Button
            type="button"
            size="sm"
            variant="ghost"
            onPress={() => navigate("/")}
          >
            {t("errors.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}

