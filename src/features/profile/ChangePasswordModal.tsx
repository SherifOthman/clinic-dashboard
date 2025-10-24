import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Eye, EyeOff, Key } from "lucide-react";
import { useState } from "react";

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: { currentPassword: string; newPassword: string }) => void;
  isLoading?: boolean;
}

export function ChangePasswordModal({
  isOpen,
  onClose,
  onSave,
  isLoading = false,
}: ChangePasswordModalProps) {
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.currentPassword) {
      newErrors.currentPassword = "Current password is required";
    }

    if (!formData.newPassword) {
      newErrors.newPassword = "New password is required";
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = "Password must be at least 8 characters";
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      newErrors.newPassword =
        "Password must contain uppercase, lowercase, and number";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your new password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (formData.currentPassword === formData.newPassword) {
      newErrors.newPassword =
        "New password must be different from current password";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validateForm()) {
      onSave({
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
      });
    }
  };

  const handleClose = () => {
    setFormData({
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    setErrors({});
    setShowPasswords({
      current: false,
      new: false,
      confirm: false,
    });
    onClose();
  };

  const togglePasswordVisibility = (field: keyof typeof showPasswords) => {
    setShowPasswords((prev) => ({
      ...prev,
      [field]: !prev[field],
    }));
  };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[a-z]/.test(password)) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/\d/.test(password)) strength++;
    if (/[^a-zA-Z\d]/.test(password)) strength++;

    return strength;
  };

  const getStrengthColor = (strength: number) => {
    if (strength < 2) return "danger";
    if (strength < 4) return "warning";
    return "success";
  };

  const getStrengthLabel = (strength: number) => {
    if (strength < 2) return "Weak";
    if (strength < 4) return "Medium";
    return "Strong";
  };

  const passwordStrength = getPasswordStrength(formData.newPassword);

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalContent>
        <ModalHeader className="flex items-center gap-2">
          <Key size={20} />
          Change Password
        </ModalHeader>
        <ModalBody>
          <div className="space-y-4">
            <Input
              label="Current Password"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, currentPassword: value }))
              }
              variant="bordered"
              isInvalid={!!errors.currentPassword}
              errorMessage={errors.currentPassword}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => togglePasswordVisibility("current")}
                >
                  {showPasswords.current ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
              }
            />

            <Input
              label="New Password"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, newPassword: value }))
              }
              variant="bordered"
              isInvalid={!!errors.newPassword}
              errorMessage={errors.newPassword}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => togglePasswordVisibility("new")}
                >
                  {showPasswords.new ? <EyeOff size={16} /> : <Eye size={16} />}
                </Button>
              }
            />

            {formData.newPassword && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-default-600">
                    Password Strength:
                  </span>
                  <span
                    className={`text-sm font-medium ${
                      getStrengthColor(passwordStrength) === "danger"
                        ? "text-danger"
                        : getStrengthColor(passwordStrength) === "warning"
                          ? "text-warning"
                          : "text-success"
                    }`}
                  >
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </div>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((level) => (
                    <div
                      key={level}
                      className={`h-2 flex-1 rounded ${
                        level <= passwordStrength
                          ? getStrengthColor(passwordStrength) === "danger"
                            ? "bg-danger"
                            : getStrengthColor(passwordStrength) === "warning"
                              ? "bg-warning"
                              : "bg-success"
                          : "bg-default-200"
                      }`}
                    />
                  ))}
                </div>
              </div>
            )}

            <Input
              label="Confirm New Password"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, confirmPassword: value }))
              }
              variant="bordered"
              isInvalid={!!errors.confirmPassword}
              errorMessage={errors.confirmPassword}
              endContent={
                <Button
                  isIconOnly
                  variant="light"
                  size="sm"
                  onPress={() => togglePasswordVisibility("confirm")}
                >
                  {showPasswords.confirm ? (
                    <EyeOff size={16} />
                  ) : (
                    <Eye size={16} />
                  )}
                </Button>
              }
            />

            <div className="p-3 bg-default-50 rounded-lg">
              <h4 className="text-sm font-medium mb-2">
                Password Requirements:
              </h4>
              <ul className="text-xs text-default-600 space-y-1">
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      formData.newPassword.length >= 8
                        ? "bg-success"
                        : "bg-default-300"
                    }`}
                  />
                  At least 8 characters
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /[a-z]/.test(formData.newPassword)
                        ? "bg-success"
                        : "bg-default-300"
                    }`}
                  />
                  One lowercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /[A-Z]/.test(formData.newPassword)
                        ? "bg-success"
                        : "bg-default-300"
                    }`}
                  />
                  One uppercase letter
                </li>
                <li className="flex items-center gap-2">
                  <div
                    className={`w-2 h-2 rounded-full ${
                      /\d/.test(formData.newPassword)
                        ? "bg-success"
                        : "bg-default-300"
                    }`}
                  />
                  One number
                </li>
              </ul>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={handleClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isLoading}>
            Change Password
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
