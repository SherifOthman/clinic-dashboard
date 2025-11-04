import { Tab, Tabs } from "@heroui/tabs";
import { Activity, Lock, Settings, User } from "lucide-react";
import { useState } from "react";

import {
  ActivityLog,
  ChangePasswordModal,
  mockActivityLogs,
  mockUserProfile,
  PreferencesSettings,
  ProfileEditModal,
  ProfileInfo,
  SecuritySettings,
  UserProfile,
} from "@/features/profile";

export default function Profile() {
  const [profile, setProfile] = useState<UserProfile>(mockUserProfile);
  const [activities] = useState(mockActivityLogs);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  const handleProfileUpdate = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        bio: formData.bio,
        address: {
          street: formData.street,
          city: formData.city,
          state: formData.state,
          zipCode: formData.zipCode,
          country: formData.country,
        },
      }));
      setIsLoading(false);
      setIsEditModalOpen(false);
    }, 1000);
  };

  const handleSecurityUpdate = (updates: Partial<UserProfile["security"]>) => {
    setProfile((prev) => ({
      ...prev,
      security: { ...prev.security, ...updates },
    }));
  };

  const handlePreferencesUpdate = (
    updates: Partial<UserProfile["preferences"]>
  ) => {
    setProfile((prev) => ({
      ...prev,
      preferences: { ...prev.preferences, ...updates },
    }));
  };

  const handlePasswordChange = (_data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    setIsLoading(true);
    setTimeout(() => {
      setProfile((prev) => ({
        ...prev,
        security: {
          ...prev.security,
          lastPasswordChange: new Date().toISOString().split("T")[0],
        },
      }));
      setIsLoading(false);
      setIsPasswordModalOpen(false);
    }, 1500);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Profile Settings</h1>
        <p className="text-sm text-default-500">
          Manage your account settings and preferences
        </p>
      </div>

      {/* Tabs */}
      <Tabs
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider",
          cursor: "w-full bg-primary",
          tab: "max-w-fit px-0 h-12",
          tabContent: "group-data-[selected=true]:text-primary",
        }}
        selectedKey={activeTab}
        variant="underlined"
        onSelectionChange={(key) => setActiveTab(key as string)}
      >
        <Tab
          key="profile"
          title={
            <div className="flex items-center gap-2">
              <User size={18} />
              Profile
            </div>
          }
        >
          <div className="py-6">
            <ProfileInfo
              profile={profile}
              onEdit={() => setIsEditModalOpen(true)}
            />
          </div>
        </Tab>

        <Tab
          key="security"
          title={
            <div className="flex items-center gap-2">
              <Lock size={18} />
              Security
            </div>
          }
        >
          <div className="py-6">
            <SecuritySettings
              profile={profile}
              onChangePassword={() => setIsPasswordModalOpen(true)}
              onUpdateSecurity={handleSecurityUpdate}
            />
          </div>
        </Tab>

        <Tab
          key="preferences"
          title={
            <div className="flex items-center gap-2">
              <Settings size={18} />
              Preferences
            </div>
          }
        >
          <div className="py-6">
            <PreferencesSettings
              profile={profile}
              onUpdatePreferences={handlePreferencesUpdate}
            />
          </div>
        </Tab>

        <Tab
          key="activity"
          title={
            <div className="flex items-center gap-2">
              <Activity size={18} />
              Activity
            </div>
          }
        >
          <div className="py-6">
            <ActivityLog activities={activities} />
          </div>
        </Tab>
      </Tabs>

      {/* Modals */}
      <ProfileEditModal
        isLoading={isLoading}
        isOpen={isEditModalOpen}
        profile={profile}
        onClose={() => setIsEditModalOpen(false)}
        onSave={handleProfileUpdate}
      />

      <ChangePasswordModal
        isLoading={isLoading}
        isOpen={isPasswordModalOpen}
        onClose={() => setIsPasswordModalOpen(false)}
        onSave={handlePasswordChange}
      />
    </div>
  );
}
