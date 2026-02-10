import { RouterLink } from "@/core/components/ui/RouterLink";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function NotFoundPage() {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-default-50 to-default-100 p-4">
      <Card className="max-w-lg w-full shadow-xl">
        <CardBody className="text-center space-y-6 p-8">
          {/* Animated 404 */}
          <div className="relative">
            <div className="text-8xl font-bold text-primary/20 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="w-16 h-16 text-primary/60 animate-pulse" />
            </div>
          </div>

          {/* Error Message */}
          <div className="space-y-3">
            <h1 className="text-3xl font-bold text-foreground">
              {t("errors.pageNotFound")}
            </h1>
            <p className="text-lg text-default-600">
              {t("errors.pageNotFoundMessage")}
            </p>
            <p className="text-sm text-default-500">
              {t("errors.pageNotFoundHelp")}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              as={RouterLink}
              to="/"
              color="primary"
              size="lg"
              startContent={<Home className="w-4 h-4" />}
              className="flex-1"
            >
              {t("errors.goToDashboard")}
            </Button>
            <Button
              variant="bordered"
              size="lg"
              startContent={<ArrowLeft className="w-4 h-4" />}
              onPress={() => window.history.back()}
              className="flex-1"
            >
              {t("errors.goBack")}
            </Button>
          </div>

          {/* Help Text */}
          <div className="pt-4 border-t border-divider">
            <p className="text-xs text-default-400">
              {t("errors.contactSupport")}
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
