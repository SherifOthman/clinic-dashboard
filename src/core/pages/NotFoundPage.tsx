import { Button, Card } from "@heroui/react";
import { ArrowLeft, Home, Search } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function NotFoundPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <Card.Content className="p-8 text-center">
          <div className="relative mb-8">
            <h1 className="text-primary text-[8rem] font-bold opacity-20 select-none">
              404
            </h1>
            <div className="absolute inset-0 flex items-center justify-center">
              <Search className="text-primary h-16 w-16 opacity-60" />
            </div>
          </div>

          <div className="mb-8">
            <h2 className="mb-2 text-3xl font-bold">
              {t("errors.pageNotFound")}
            </h2>
            <p className="text-foreground-500 mb-2">
              {t("errors.pageNotFoundMessage")}
            </p>
            <p className="text-foreground-400 text-sm">
              {t("errors.pageNotFoundHelp")}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button
              variant="primary"
              size="lg"
              fullWidth
              onPress={() => navigate("/")}
            >
              <Home className="h-5 w-5" />
              {t("errors.goToDashboard")}
            </Button>
            <Button
              variant="outline"
              size="lg"
              fullWidth
              onPress={() => window.history.back()}
            >
              <ArrowLeft className="h-5 w-5" />
              {t("errors.goBack")}
            </Button>
          </div>

          <div className="border-divider mt-8 border-t pt-6">
            <p className="text-foreground-400 text-xs">
              {t("errors.contactSupport")}
            </p>
          </div>
        </Card.Content>
      </Card>
    </div>
  );
}

