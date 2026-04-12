import { useTranslation } from "react-i18next";
import { Staff } from "./components/Staff";

export default function StaffPage() {
  const { t } = useTranslation();

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">{t("staff.title")}</h1>
        <p className="text-default-500 text-sm">{t("staff.subtitle")}</p>
      </div>
      <Staff />
    </div>
  );
}

