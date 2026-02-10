import { Button } from "@heroui/button";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

export default function UnauthorizedPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-danger mb-4">403</h1>
        <h2 className="text-2xl font-semibold mb-4">
          {t("errors.accessDenied")}
        </h2>
        <p className="text-default-600 mb-8">{t("errors.noPermission")}</p>
        <div className="space-x-4">
          <Button as={Link} to="/dashboard" color="primary">
            {t("errors.goToDashboard")}
          </Button>
          <Button as={Link} to="/" variant="light">
            {t("errors.goHome")}
          </Button>
        </div>
      </div>
    </div>
  );
}
