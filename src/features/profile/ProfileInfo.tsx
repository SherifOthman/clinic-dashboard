import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Divider } from "@heroui/divider";
import {
  Calendar,
  Clock,
  Edit,
  Mail,
  MapPin,
  Phone,
  Shield,
  User,
} from "lucide-react";
import { UserProfile } from "./mockData";

interface ProfileInfoProps {
  profile: UserProfile;
  onEdit: () => void;
}

export function ProfileInfo({ profile, onEdit }: ProfileInfoProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Profile Card */}
      <Card className="shadow-sm border border-divider">
        <CardHeader className="flex flex-row items-center justify-between">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <Button
            size="sm"
            variant="bordered"
            startContent={<Edit size={16} />}
            onPress={onEdit}
          >
            Edit Profile
          </Button>
        </CardHeader>
        <CardBody className="space-y-6">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Avatar
              src={profile.avatar}
              size="lg"
              className="w-20 h-20"
              name={`${profile.firstName} ${profile.lastName}`}
            />
            <div className="flex-1 space-y-2">
              <div>
                <h3 className="text-2xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h3>
                <p className="text-lg text-default-600">{profile.role}</p>
                <p className="text-sm text-default-500">{profile.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <Chip
                  color={profile.status === "active" ? "success" : "default"}
                  size="sm"
                  variant="flat"
                >
                  {profile.status}
                </Chip>
                {profile.security.twoFactorEnabled && (
                  <Chip
                    color="primary"
                    size="sm"
                    variant="flat"
                    startContent={<Shield size={12} />}
                  >
                    2FA Enabled
                  </Chip>
                )}
              </div>
            </div>
          </div>

          {/* Bio */}
          {profile.bio && (
            <>
              <Divider />
              <div>
                <h4 className="font-medium text-default-700 mb-2">About</h4>
                <p className="text-sm text-default-600 leading-relaxed">
                  {profile.bio}
                </p>
              </div>
            </>
          )}

          <Divider />

          {/* Contact Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-medium text-default-700">
                Contact Information
              </h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail size={16} className="text-default-400" />
                  <span className="text-default-600">{profile.email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone size={16} className="text-default-400" />
                  <span className="text-default-600">{profile.phone}</span>
                </div>
                <div className="flex items-start gap-2 text-sm">
                  <MapPin size={16} className="text-default-400 mt-0.5" />
                  <div className="text-default-600">
                    <div>{profile.address.street}</div>
                    <div>
                      {profile.address.city}, {profile.address.state}{" "}
                      {profile.address.zipCode}
                    </div>
                    <div>{profile.address.country}</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-medium text-default-700">Work Information</h4>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <User size={16} className="text-default-400" />
                  <span className="text-default-600">
                    {profile.role} - {profile.department}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Calendar size={16} className="text-default-400" />
                  <span className="text-default-600">
                    Joined {formatDate(profile.dateJoined)}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock size={16} className="text-default-400" />
                  <span className="text-default-600">
                    Last login: {formatDateTime(profile.lastLogin)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardBody>
      </Card>

      {/* Statistics Card */}
      <Card className="shadow-sm border border-divider">
        <CardHeader>
          <h2 className="text-xl font-semibold">Activity Statistics</h2>
        </CardHeader>
        <CardBody>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {profile.stats.patientsManaged}
              </div>
              <div className="text-sm text-default-600">Patients Managed</div>
            </div>
            <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {profile.stats.appointmentsScheduled}
              </div>
              <div className="text-sm text-default-600">Appointments</div>
            </div>
            <div className="text-center p-4 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {profile.stats.recordsCreated}
              </div>
              <div className="text-sm text-default-600">Records Created</div>
            </div>
            <div className="text-center p-4 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">
                {profile.stats.loginCount}
              </div>
              <div className="text-sm text-default-600">Total Logins</div>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
