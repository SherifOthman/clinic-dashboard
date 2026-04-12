import { useMe } from "@/features/auth/hooks";
import { useTranslation } from "react-i18next";
import { AccountInfoCard } from "./components/AccountInfoCard";
import { ChangePasswordForm } from "./components/ChangePasswordForm";
import { ProfileForm } from "./components/ProfileForm";
import { ProfileImageCard } from "./components/ProfileImageCard";

export default function ProfilePage() {
  const { t } = useTranslation();
  const { user } = useMe();

  if (!user) return null;

  return (
    <div className="mx-auto max-w-7xl">
      <div className="mb-6">
        <h1 className="mb-2 text-3xl font-bold">{t("profile.title")}</h1>
        <p className="text-default-500 text-sm">{t("profile.subtitle")}</p>
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-[300px_1fr]">
        <ProfileImageCard user={user} />
        <ProfileForm user={user} />
      </div>
      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        <ChangePasswordForm />
        <AccountInfoCard user={user} />
      </div>
    </div>
  );
}

