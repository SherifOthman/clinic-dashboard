import { PageContainer } from "@/core/components/ui/PageContainer";
import { ChangePasswordForm } from "@/features/auth/components/ChangePasswordForm";
import { ProfileForm } from "@/features/auth/components/ProfileForm";
import { ProfileImageCard } from "@/features/auth/components/ProfileImageCard";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { AccountInfoCard, ProfileHeader } from "../components";

export function ProfilePage() {
  const { user } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <PageContainer>
      <div className="max-w-4xl mx-auto space-y-6">
        <ProfileHeader />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <ProfileImageCard user={user} />
          <ProfileForm user={user} />
        </div>

        <ChangePasswordForm />
        <AccountInfoCard user={user} />
      </div>
    </PageContainer>
  );
}
