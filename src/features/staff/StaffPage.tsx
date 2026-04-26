import { useTranslation } from "react-i18next";
import { Staff } from "./components/Staff";
import { PageHeader } from "@/core/components/ui/PageHeader";

export default function StaffPage() {
  const { t } = useTranslation();
  return (
    <div>
      <PageHeader title={t("staff.title")} subtitle={t("staff.subtitle")} />
      <Staff />
    </div>
  );
}

