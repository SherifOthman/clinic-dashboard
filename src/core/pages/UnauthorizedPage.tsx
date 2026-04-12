import { Button } from "@heroui/react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function UnauthorizedPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-danger mb-4 text-9xl font-bold">403</h1>
        <h2 className="mb-2 text-3xl font-semibold">
          {t("errors.accessDenied")}
        </h2>
        <p className="text-foreground-500 mb-8">{t("errors.noPermission")}</p>
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

