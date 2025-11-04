import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import { Switch } from "@heroui/switch";
import {
  Calendar,
  Key,
  Monitor,
  Shield,
  ShieldCheck,
  Smartphone,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import { UserProfile } from "./mockData";

interface SecuritySettingsProps {
  profile: UserProfile;
  onUpdateSecurity: (updates: Partial<UserProfile["security"]>) => void;
  onChangePassword: () => void;
}

export function SecuritySettings({
  profile,
  onUpdateSecurity,
  onChangePassword,
}: SecuritySettingsProps) {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(
    profile.security.twoFactorEnabled
  );

  const handleTwoFactorToggle = (enabled: boolean) => {
    setTwoFactorEnabled(enabled);
    onUpdateSecurity({ twoFactorEnabled: enabled });
  };

  const handleTerminateSession = (sessionId: string) => {
    const updatedSessions = profile.security.loginSessions.filter(
      (session) => session.id !== sessionId
    );
    onUpdateSecurity({ loginSessions: updatedSessions });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getDeviceIcon = (device: string) => {
    if (
      device.toLowerCase().includes("iphone") ||
      device.toLowerCase().includes("mobile")
    ) {
      return <Smartphone size={16} />;
    }
    return <Monitor size={16} />;
  };

  return (
    <div className="space-y-6">
      {/* Password & Authentication */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <Shield size={20} />
            Password & Authentication
          </h2>
        </CardHeader>
        <CardBody className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium">Password</h3>
              <p className="text-sm text-default-500">
                Last changed: {formatDate(profile.security.lastPasswordChange)}
              </p>
            </div>
            <Button
              variant="bordered"
              startContent={<Key size={16} />}
              onPress={onChangePassword}
            >
              Change Password
            </Button>
          </div>

          <Divider />

          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <ShieldCheck size={16} />
                Two-Factor Authentication
              </h3>
              <p className="text-sm text-default-500">
                Add an extra layer of security to your account
              </p>
            </div>
            <Switch
              isSelected={twoFactorEnabled}
              onValueChange={handleTwoFactorToggle}
              color="success"
            />
          </div>

          {twoFactorEnabled && (
            <div className="p-3 bg-success-50 dark:bg-success-950 rounded-lg">
              <p className="text-sm text-success-700 dark:text-success-300 flex items-center gap-2">
                <ShieldCheck size={16} />
                Two-factor authentication is enabled and protecting your account
              </p>
            </div>
          )}
        </CardBody>
      </Card>

      {/* Active Sessions */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold">Active Sessions</h2>
          <p className="text-sm text-default-500">
            Manage your active login sessions across devices
          </p>
        </CardHeader>
        <CardBody>
          <div className="space-y-4">
            {profile.security.loginSessions.map((session) => (
              <div
                key={session.id}
                className="flex items-center justify-between p-4 border border-divider rounded-lg"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-default-100 rounded-lg">
                    {getDeviceIcon(session.device)}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium">{session.device}</h3>
                      {session.current && (
                        <Chip color="success" size="sm" variant="flat">
                          Current
                        </Chip>
                      )}
                    </div>
                    <p className="text-sm text-default-500">
                      {session.location} • Last active:{" "}
                      {formatDateTime(session.lastActive)}
                    </p>
                  </div>
                </div>
                {!session.current && (
                  <Button
                    size="sm"
                    color="danger"
                    variant="light"
                    startContent={<Trash2 size={14} />}
                    onPress={() => handleTerminateSession(session.id)}
                  >
                    Terminate
                  </Button>
                )}
              </div>
            ))}
          </div>

          <Divider className="my-4" />

          <div className="flex justify-between items-center">
            <div>
              <h3 className="font-medium">Terminate All Other Sessions</h3>
              <p className="text-sm text-default-500">
                Sign out of all devices except this one
              </p>
            </div>
            <Button
              color="danger"
              variant="bordered"
              startContent={<Trash2 size={16} />}
              onPress={() => {
                const currentSession = profile.security.loginSessions.find(
                  (s) => s.current
                );
                if (currentSession) {
                  onUpdateSecurity({ loginSessions: [currentSession] });
                }
              }}
            >
              Terminate All
            </Button>
          </div>
        </CardBody>
      </Card>

      {/* Security Tips */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold">Security Recommendations</h2>
        </CardHeader>
        <CardBody>
          <div className="space-y-3">
            <div className="flex items-start gap-3 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Shield className="text-blue-500 mt-0.5" size={16} />
              <div>
                <h3 className="font-medium text-blue-700 dark:text-blue-300">
                  Use Strong Passwords
                </h3>
                <p className="text-sm text-blue-600 dark:text-blue-400">
                  Use a unique, complex password with at least 12 characters
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-green-50 dark:bg-green-950 rounded-lg">
              <ShieldCheck className="text-green-500 mt-0.5" size={16} />
              <div>
                <h3 className="font-medium text-green-700 dark:text-green-300">
                  Enable Two-Factor Authentication
                </h3>
                <p className="text-sm text-green-600 dark:text-green-400">
                  Add an extra layer of security to protect your account
                </p>
              </div>
            </div>
            <div className="flex items-start gap-3 p-3 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <Calendar className="text-orange-500 mt-0.5" size={16} />
              <div>
                <h3 className="font-medium text-orange-700 dark:text-orange-300">
                  Regular Security Reviews
                </h3>
                <p className="text-sm text-orange-600 dark:text-orange-400">
                  Review your active sessions and security settings regularly
                </p>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
