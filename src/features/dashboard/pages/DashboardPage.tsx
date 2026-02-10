import { PageContainer } from "@/core/components/ui/PageContainer";
import { useTranslation } from "react-i18next";
import { DashboardStats, WelcomeCard } from "../components";

export function DashboardPage() {
  const { t } = useTranslation();

  return (
    <PageContainer>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold">{t("dashboard.title")}</h1>
          <p className="text-default-600">{t("dashboard.welcome")}</p>
        </div>

        <DashboardStats />
        <WelcomeCard />
      </div>
    </PageContainer>
  );
}
