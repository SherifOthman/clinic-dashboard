import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import {
  Bell,
  Globe,
  Mail,
  MessageSquare,
  Monitor,
  Moon,
  Palette,
  Settings,
  Smartphone,
  Sun,
} from "lucide-react";
import { useState } from "react";

import { UserProfile } from "./mockData";

interface PreferencesSettingsProps {
  profile: UserProfile;
  onUpdatePreferences: (updates: Partial<UserProfile["preferences"]>) => void;
}

export function PreferencesSettings({
  profile,
  onUpdatePreferences,
}: PreferencesSettingsProps) {
  const [preferences, setPreferences] = useState(profile.preferences);

  const handleThemeChange = (theme: "light" | "dark" | "system") => {
    const updated = { ...preferences, theme };

    setPreferences(updated);
    onUpdatePreferences(updated);
  };

  const handleNotificationChange = (
    type: keyof typeof preferences.notifications,
    enabled: boolean
  ) => {
    const updated = {
      ...preferences,
      notifications: { ...preferences.notifications, [type]: enabled },
    };

    setPreferences(updated);
    onUpdatePreferences(updated);
  };

  const handleLanguageChange = (language: string) => {
    const updated = { ...preferences, language };

    setPreferences(updated);
    onUpdatePreferences(updated);
  };

  const handleTimezoneChange = (timezone: string) => {
    const updated = { ...preferences, timezone };

    setPreferences(updated);
    onUpdatePreferences(updated);
  };

  return (
    <div className="space-y-6">
      {/* Appearance */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Palette size={20} />
            Appearance
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div>
            <h3 className="font-medium mb-3">Theme</h3>
            <div className="grid grid-cols-3 gap-3">
              {[
                { key: "light", label: "Light", icon: <Sun size={16} /> },
                { key: "dark", label: "Dark", icon: <Moon size={16} /> },
                { key: "system", label: "System", icon: <Monitor size={16} /> },
              ].map((theme) => (
                <Button
                  key={theme.key}
                  className="justify-start"
                  color={
                    preferences.theme === theme.key ? "primary" : "default"
                  }
                  startContent={theme.icon}
                  variant={
                    preferences.theme === theme.key ? "solid" : "bordered"
                  }
                  onPress={() => handleThemeChange(theme.key as any)}
                >
                  {theme.label}
                </Button>
              ))}
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Notifications */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Bell size={20} />
            Notifications
          </h2>
          <p className="text-sm text-default-500">
            Choose how you want to be notified about important updates
          </p>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
                <Mail className="text-blue-500" size={16} />
              </div>
              <div>
                <h3 className="font-medium">Email Notifications</h3>
                <p className="text-sm text-default-500">
                  Receive notifications via email
                </p>
              </div>
            </div>
            <Switch
              color="primary"
              isSelected={preferences.notifications.email}
              onValueChange={(enabled) =>
                handleNotificationChange("email", enabled)
              }
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
                <Smartphone className="text-green-500" size={16} />
              </div>
              <div>
                <h3 className="font-medium">Push Notifications</h3>
                <p className="text-sm text-default-500">
                  Receive push notifications on your devices
                </p>
              </div>
            </div>
            <Switch
              color="success"
              isSelected={preferences.notifications.push}
              onValueChange={(enabled) =>
                handleNotificationChange("push", enabled)
              }
            />
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
                <MessageSquare className="text-purple-500" size={16} />
              </div>
              <div>
                <h3 className="font-medium">SMS Notifications</h3>
                <p className="text-sm text-default-500">
                  Receive notifications via text message
                </p>
              </div>
            </div>
            <Switch
              color="secondary"
              isSelected={preferences.notifications.sms}
              onValueChange={(enabled) =>
                handleNotificationChange("sms", enabled)
              }
            />
          </div>
        </CardBody>
      </Card>

      {/* Language & Region */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Globe size={20} />
            Language & Region
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Select
                label="Language"
                selectedKeys={[preferences.language]}
                startContent={<Globe size={16} />}
                variant="bordered"
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <SelectItem key="English">English</SelectItem>
                <SelectItem key="Spanish">Español</SelectItem>
                <SelectItem key="French">Français</SelectItem>
                <SelectItem key="German">Deutsch</SelectItem>
                <SelectItem key="Italian">Italiano</SelectItem>
                <SelectItem key="Portuguese">Português</SelectItem>
                <SelectItem key="Chinese">中文</SelectItem>
                <SelectItem key="Japanese">日本語</SelectItem>
              </Select>
            </div>
            <div>
              <Select
                label="Timezone"
                selectedKeys={[preferences.timezone]}
                startContent={<Settings size={16} />}
                variant="bordered"
                onChange={(e) => handleTimezoneChange(e.target.value)}
              >
                <SelectItem key="America/Los_Angeles">
                  Pacific Time (PT)
                </SelectItem>
                <SelectItem key="America/Denver">Mountain Time (MT)</SelectItem>
                <SelectItem key="America/Chicago">Central Time (CT)</SelectItem>
                <SelectItem key="America/New_York">
                  Eastern Time (ET)
                </SelectItem>
                <SelectItem key="Europe/London">
                  Greenwich Mean Time (GMT)
                </SelectItem>
                <SelectItem key="Europe/Paris">
                  Central European Time (CET)
                </SelectItem>
                <SelectItem key="Asia/Tokyo">
                  Japan Standard Time (JST)
                </SelectItem>
                <SelectItem key="Asia/Shanghai">
                  China Standard Time (CST)
                </SelectItem>
                <SelectItem key="Australia/Sydney">
                  Australian Eastern Time (AET)
                </SelectItem>
              </Select>
            </div>
          </div>

          <div className="p-4 bg-default-50 rounded-lg">
            <h3 className="font-medium mb-2">Current Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-default-500">Language:</span>{" "}
                <span className="font-medium">{preferences.language}</span>
              </div>
              <div>
                <span className="text-default-500">Timezone:</span>{" "}
                <span className="font-medium">
                  {preferences.timezone.replace("_", " ")}
                </span>
              </div>
              <div>
                <span className="text-default-500">Current Time:</span>{" "}
                <span className="font-medium">
                  {new Date().toLocaleString("en-US", {
                    timeZone: preferences.timezone,
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZoneName: "short",
                  })}
                </span>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Privacy */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold">Privacy Settings</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-medium mb-2">Data Collection</h3>
              <p className="text-sm text-default-600 mb-3">
                We collect minimal data necessary for the application to
                function. Your medical data is encrypted and stored securely.
              </p>
              <Button size="sm" variant="bordered">
                View Privacy Policy
              </Button>
            </div>
            <div className="p-4 border border-divider rounded-lg">
              <h3 className="font-medium mb-2">Data Export</h3>
              <p className="text-sm text-default-600 mb-3">
                You can export your personal data at any time.
              </p>
              <Button size="sm" variant="bordered">
                Export My Data
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
