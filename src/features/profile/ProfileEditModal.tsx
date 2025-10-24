import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";
import { UserProfile } from "./mockData";

interface ProfileFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  bio: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

interface ProfileEditModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: UserProfile;
  onSave: (data: ProfileFormData) => void;
  isLoading?: boolean;
}

export function ProfileEditModal({
  isOpen,
  onClose,
  profile,
  onSave,
  isLoading = false,
}: ProfileEditModalProps) {
  const [formData, setFormData] = useState<ProfileFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    bio: "",
    street: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
  });

  useEffect(() => {
    if (profile && isOpen) {
      setFormData({
        firstName: profile.firstName,
        lastName: profile.lastName,
        email: profile.email,
        phone: profile.phone,
        bio: profile.bio || "",
        street: profile.address.street,
        city: profile.address.city,
        state: profile.address.state,
        zipCode: profile.address.zipCode,
        country: profile.address.country,
      });
    }
  }, [profile, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl" scrollBehavior="inside">
      <ModalContent>
        <ModalHeader>Edit Profile</ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Personal Information</h3>
              <div className="grid grid-cols-2 gap-3">
                <Input
                  size="sm"
                  label="First Name"
                  value={formData.firstName}
                  onValueChange={(value) =>
                    handleInputChange("firstName", value)
                  }
                  variant="bordered"
                  isRequired
                />
                <Input
                  size="sm"
                  label="Last Name"
                  value={formData.lastName}
                  onValueChange={(value) =>
                    handleInputChange("lastName", value)
                  }
                  variant="bordered"
                  isRequired
                />
                <Input
                  size="sm"
                  label="Email"
                  type="email"
                  value={formData.email}
                  onValueChange={(value) => handleInputChange("email", value)}
                  variant="bordered"
                  isRequired
                />
                <Input
                  size="sm"
                  label="Phone"
                  value={formData.phone}
                  onValueChange={(value) => handleInputChange("phone", value)}
                  variant="bordered"
                  isRequired
                />
              </div>
              <div className="mt-3">
                <Textarea
                  size="sm"
                  label="Bio"
                  value={formData.bio}
                  onValueChange={(value) => handleInputChange("bio", value)}
                  variant="bordered"
                  placeholder="Tell us about yourself..."
                  maxRows={3}
                />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-medium mb-3">Address Information</h3>
              <div className="space-y-3">
                <Input
                  size="sm"
                  label="Street Address"
                  value={formData.street}
                  onValueChange={(value) => handleInputChange("street", value)}
                  variant="bordered"
                />
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    size="sm"
                    label="City"
                    value={formData.city}
                    onValueChange={(value) => handleInputChange("city", value)}
                    variant="bordered"
                  />
                  <Input
                    size="sm"
                    label="State/Province"
                    value={formData.state}
                    onValueChange={(value) => handleInputChange("state", value)}
                    variant="bordered"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    size="sm"
                    label="ZIP/Postal Code"
                    value={formData.zipCode}
                    onValueChange={(value) =>
                      handleInputChange("zipCode", value)
                    }
                    variant="bordered"
                  />
                  <Select
                    size="sm"
                    label="Country"
                    selectedKeys={formData.country ? [formData.country] : []}
                    onChange={(e) =>
                      handleInputChange("country", e.target.value)
                    }
                    variant="bordered"
                  >
                    <SelectItem key="United States">United States</SelectItem>
                    <SelectItem key="Canada">Canada</SelectItem>
                    <SelectItem key="United Kingdom">United Kingdom</SelectItem>
                    <SelectItem key="Australia">Australia</SelectItem>
                    <SelectItem key="Germany">Germany</SelectItem>
                    <SelectItem key="France">France</SelectItem>
                    <SelectItem key="Japan">Japan</SelectItem>
                    <SelectItem key="Other">Other</SelectItem>
                  </Select>
                </div>
              </div>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isLoading}>
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
