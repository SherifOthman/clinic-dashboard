import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useEffect, useState } from "react";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
}

interface DoctorFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: string;
}

interface DoctorModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  doctor?: Doctor;
  onSave: (data: DoctorFormData) => void;
  isLoading?: boolean;
}

export function DoctorModal({
  isOpen,
  onClose,
  mode,
  doctor,
  onSave,
  isLoading = false,
}: DoctorModalProps) {
  const [formData, setFormData] = useState<DoctorFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    specialization: "",
    licenseNumber: "",
    experience: "",
  });

  useEffect(() => {
    if (doctor && (mode === "edit" || mode === "view")) {
      setFormData({
        firstName: doctor.firstName,
        lastName: doctor.lastName,
        email: doctor.email,
        phone: doctor.phone,
        specialization: doctor.specialization,
        licenseNumber: doctor.licenseNumber,
        experience: doctor.experience,
      });
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        specialization: "",
        licenseNumber: "",
        experience: "",
      });
    }
  }, [doctor, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Doctor Details";
      case "edit":
        return "Edit Doctor";
      case "add":
        return "Add New Doctor";
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>{getTitle()}</ModalHeader>
        <ModalBody>
          <div className="grid grid-cols-2 gap-3">
            <Input
              size="sm"
              label="First Name"
              value={formData.firstName}
              onValueChange={(value) =>
                setFormData({ ...formData, firstName: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Last Name"
              value={formData.lastName}
              onValueChange={(value) =>
                setFormData({ ...formData, lastName: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Email"
              type="email"
              value={formData.email}
              onValueChange={(value) =>
                setFormData({ ...formData, email: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Phone"
              value={formData.phone}
              onValueChange={(value) =>
                setFormData({ ...formData, phone: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Specialization"
              value={formData.specialization}
              onValueChange={(value) =>
                setFormData({ ...formData, specialization: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="License Number"
              value={formData.licenseNumber}
              onValueChange={(value) =>
                setFormData({ ...formData, licenseNumber: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Years of Experience"
              value={formData.experience}
              onValueChange={(value) =>
                setFormData({ ...formData, experience: value })
              }
              variant="bordered"
              className="col-span-2"
              isReadOnly={mode === "view"}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode !== "view" && (
            <Button color="primary" onPress={handleSave} isLoading={isLoading}>
              {mode === "edit" ? "Update" : "Add"} Doctor
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
