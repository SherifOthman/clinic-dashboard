import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Divider } from "@heroui/divider";
import { Input, Textarea } from "@heroui/input";
import { Select, SelectItem } from "@heroui/select";
import { Switch } from "@heroui/switch";
import {
  Bell,
  Camera,
  Globe,
  Mail,
  MapPin,
  Palette,
  Phone,
  Save,
  Shield,
  User,
} from "lucide-react";
import { useState } from "react";

export default function SettingsPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    push: true,
    appointments: true,
    reports: false,
  });

  const handleSave = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      console.log("Settings saved");
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-sm text-default-500">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Settings */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <User size={20} />
                <h3 className="text-lg font-semibold">Profile Information</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar
                  src="https://i.pravatar.cc/150?u=admin"
                  size="lg"
                  className="w-20 h-20"
                />
                <div>
                  <Button
                    size="sm"
                    variant="bordered"
                    startContent={<Camera size={16} />}
                  >
                    Change Photo
                  </Button>
                  <p className="text-xs text-default-500 mt-1">
                    JPG, PNG or GIF. Max size 2MB
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="Enter first name"
                  defaultValue="John"
                  variant="bordered"
                  startContent={<User size={16} />}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  defaultValue="Doe"
                  variant="bordered"
                />
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email"
                  defaultValue="john.doe@clinic.com"
                  variant="bordered"
                  startContent={<Mail size={16} />}
                />
                <Input
                  label="Phone"
                  type="tel"
                  placeholder="Enter phone number"
                  defaultValue="+1 (555) 123-4567"
                  variant="bordered"
                  startContent={<Phone size={16} />}
                />
              </div>

              <Input
                label="Address"
                placeholder="Enter address"
                defaultValue="123 Medical Center Dr, Healthcare City, HC 12345"
                variant="bordered"
                startContent={<MapPin size={16} />}
              />

              <Textarea
                label="Bio"
                placeholder="Tell us about yourself"
                defaultValue="Experienced healthcare administrator with 10+ years in clinic management."
                variant="bordered"
                minRows={3}
              />
            </CardBody>
          </Card>

          {/* Security Settings */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Shield size={20} />
                <h3 className="text-lg font-semibold">Security</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Input
                label="Current Password"
                type="password"
                placeholder="Enter current password"
                variant="bordered"
              />
              <Input
                label="New Password"
                type="password"
                placeholder="Enter new password"
                variant="bordered"
              />
              <Input
                label="Confirm New Password"
                type="password"
                placeholder="Confirm new password"
                variant="bordered"
              />

              <Divider />

              <div className="space-y-3">
                <h4 className="font-medium">Two-Factor Authentication</h4>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">SMS Authentication</p>
                    <p className="text-xs text-default-500">
                      Receive codes via SMS
                    </p>
                  </div>
                  <Switch defaultSelected />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Email Authentication</p>
                    <p className="text-xs text-default-500">
                      Receive codes via email
                    </p>
                  </div>
                  <Switch />
                </div>
              </div>
            </CardBody>
          </Card>
        </div>

        {/* Preferences */}
        <div className="space-y-6">
          {/* Notifications */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Bell size={20} />
                <h3 className="text-lg font-semibold">Notifications</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Email Notifications</p>
                    <p className="text-xs text-default-500">
                      General updates and alerts
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.email}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, email: value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">SMS Notifications</p>
                    <p className="text-xs text-default-500">
                      Urgent alerts only
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.sms}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, sms: value })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Push Notifications</p>
                    <p className="text-xs text-default-500">
                      Browser notifications
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.push}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, push: value })
                    }
                  />
                </div>

                <Divider />

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Appointment Reminders</p>
                    <p className="text-xs text-default-500">
                      Daily appointment alerts
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.appointments}
                    onValueChange={(value) =>
                      setNotifications({
                        ...notifications,
                        appointments: value,
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm">Weekly Reports</p>
                    <p className="text-xs text-default-500">
                      Automated report summaries
                    </p>
                  </div>
                  <Switch
                    isSelected={notifications.reports}
                    onValueChange={(value) =>
                      setNotifications({ ...notifications, reports: value })
                    }
                  />
                </div>
              </div>
            </CardBody>
          </Card>

          {/* Appearance */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Palette size={20} />
                <h3 className="text-lg font-semibold">Appearance</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Theme"
                placeholder="Select theme"
                defaultSelectedKeys={["system"]}
                variant="bordered"
              >
                <SelectItem key="light">Light</SelectItem>
                <SelectItem key="dark">Dark</SelectItem>
                <SelectItem key="system">System</SelectItem>
              </Select>

              <Select
                label="Color Scheme"
                placeholder="Select color"
                defaultSelectedKeys={["blue"]}
                variant="bordered"
              >
                <SelectItem key="blue">Blue</SelectItem>
                <SelectItem key="green">Green</SelectItem>
                <SelectItem key="purple">Purple</SelectItem>
                <SelectItem key="orange">Orange</SelectItem>
              </Select>
            </CardBody>
          </Card>

          {/* Regional */}
          <Card className="shadow-sm">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Globe size={20} />
                <h3 className="text-lg font-semibold">Regional</h3>
              </div>
            </CardHeader>
            <CardBody className="space-y-4">
              <Select
                label="Language"
                placeholder="Select language"
                defaultSelectedKeys={["en"]}
                variant="bordered"
              >
                <SelectItem key="en">English</SelectItem>
                <SelectItem key="es">Spanish</SelectItem>
                <SelectItem key="fr">French</SelectItem>
                <SelectItem key="de">German</SelectItem>
              </Select>

              <Select
                label="Timezone"
                placeholder="Select timezone"
                defaultSelectedKeys={["utc-5"]}
                variant="bordered"
              >
                <SelectItem key="utc-5">Eastern Time (UTC-5)</SelectItem>
                <SelectItem key="utc-6">Central Time (UTC-6)</SelectItem>
                <SelectItem key="utc-7">Mountain Time (UTC-7)</SelectItem>
                <SelectItem key="utc-8">Pacific Time (UTC-8)</SelectItem>
              </Select>

              <Select
                label="Date Format"
                placeholder="Select format"
                defaultSelectedKeys={["mm-dd-yyyy"]}
                variant="bordered"
              >
                <SelectItem key="mm-dd-yyyy">MM/DD/YYYY</SelectItem>
                <SelectItem key="dd-mm-yyyy">DD/MM/YYYY</SelectItem>
                <SelectItem key="yyyy-mm-dd">YYYY-MM-DD</SelectItem>
              </Select>
            </CardBody>
          </Card>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <Button
          color="primary"
          size="lg"
          startContent={<Save size={18} />}
          onPress={handleSave}
          isLoading={isLoading}
          className="shadow-sm"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
