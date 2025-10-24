import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { Select, SelectItem } from "@heroui/select";
import { useEffect, useState } from "react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female";
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
  medicalNotes?: string;
  lastVisit?: string;
}

interface PatientFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  emergencyContact: string;
  emergencyPhone: string;
}

interface PatientModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  patient?: Patient;
  onSave: (data: PatientFormData) => void;
  isLoading?: boolean;
}

export function PatientModal({
  isOpen,
  onClose,
  mode,
  patient,
  onSave,
  isLoading = false,
}: PatientModalProps) {
  const [formData, setFormData] = useState<PatientFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    dateOfBirth: "",
    gender: "male",
    bloodType: "O+",
    emergencyContact: "",
    emergencyPhone: "",
  });

  useEffect(() => {
    if (patient && (mode === "edit" || mode === "view")) {
      setFormData({
        firstName: patient.firstName,
        lastName: patient.lastName,
        email: patient.email,
        phone: patient.phone,
        dateOfBirth: patient.dateOfBirth,
        gender: patient.gender,
        bloodType: patient.bloodType,
        emergencyContact: patient.emergencyContact,
        emergencyPhone: patient.emergencyPhone,
      });
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        dateOfBirth: "",
        gender: "male",
        bloodType: "O+",
        emergencyContact: "",
        emergencyPhone: "",
      });
    }
  }, [patient, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Patient Details";
      case "edit":
        return "Edit Patient";
      case "add":
        return "Add New Patient";
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
              label="Date of Birth"
              type="date"
              value={formData.dateOfBirth}
              onValueChange={(value) =>
                setFormData({ ...formData, dateOfBirth: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Select
              size="sm"
              label="Gender"
              selectedKeys={[formData.gender]}
              onChange={(e) =>
                setFormData({ ...formData, gender: e.target.value })
              }
              variant="bordered"
              isDisabled={mode === "view"}
            >
              <SelectItem key="male">Male</SelectItem>
              <SelectItem key="female">Female</SelectItem>
            </Select>
            <Select
              size="sm"
              label="Blood Type"
              selectedKeys={[formData.bloodType]}
              onChange={(e) =>
                setFormData({ ...formData, bloodType: e.target.value })
              }
              variant="bordered"
              isDisabled={mode === "view"}
            >
              <SelectItem key="A+">A+</SelectItem>
              <SelectItem key="A-">A-</SelectItem>
              <SelectItem key="B+">B+</SelectItem>
              <SelectItem key="B-">B-</SelectItem>
              <SelectItem key="O+">O+</SelectItem>
              <SelectItem key="O-">O-</SelectItem>
              <SelectItem key="AB+">AB+</SelectItem>
              <SelectItem key="AB-">AB-</SelectItem>
            </Select>
            <Input
              size="sm"
              label="Emergency Contact"
              value={formData.emergencyContact}
              onValueChange={(value) =>
                setFormData({ ...formData, emergencyContact: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Emergency Phone"
              value={formData.emergencyPhone}
              onValueChange={(value) =>
                setFormData({ ...formData, emergencyPhone: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
          </div>
          {mode === "view" && patient && (
            <div className="mt-4 p-4 bg-default-50 rounded-lg">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-default-500">Medical Notes</p>
                  <p className="text-sm">{patient.medicalNotes}</p>
                </div>
                <div>
                  <p className="text-sm text-default-500">Last Visit</p>
                  <p className="text-sm">{patient.lastVisit}</p>
                </div>
              </div>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            {mode === "view" ? "Close" : "Cancel"}
          </Button>
          {mode !== "view" && (
            <Button color="primary" onPress={handleSave} isLoading={isLoading}>
              {mode === "edit" ? "Update" : "Add"} Patient
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
