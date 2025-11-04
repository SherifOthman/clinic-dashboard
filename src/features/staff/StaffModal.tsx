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

interface Staff {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  schedule: string;
}

interface StaffFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: string;
  department: string;
  schedule: string;
}

interface StaffModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  staff?: Staff;
  onSave: (data: StaffFormData) => void;
  isLoading?: boolean;
}

export function StaffModal({
  isOpen,
  onClose,
  mode,
  staff,
  onSave,
  isLoading = false,
}: StaffModalProps) {
  const [formData, setFormData] = useState<StaffFormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "nurse",
    department: "",
    schedule: "",
  });

  useEffect(() => {
    if (staff && (mode === "edit" || mode === "view")) {
      setFormData({
        firstName: staff.firstName,
        lastName: staff.lastName,
        email: staff.email,
        phone: staff.phone,
        role: staff.role,
        department: staff.department,
        schedule: staff.schedule,
      });
    } else if (mode === "add") {
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "nurse",
        department: "",
        schedule: "",
      });
    }
  }, [staff, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Staff Details";
      case "edit":
        return "Edit Staff Member";
      case "add":
        return "Add New Staff Member";
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
            <Select
              size="sm"
              label="Role"
              selectedKeys={[formData.role]}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
              variant="bordered"
              isDisabled={mode === "view"}
            >
              <SelectItem key="nurse">Nurse</SelectItem>
              <SelectItem key="receptionist">Receptionist</SelectItem>
              <SelectItem key="lab-technician">Lab Technician</SelectItem>
              <SelectItem key="pharmacist">Pharmacist</SelectItem>
              <SelectItem key="medical-assistant">Medical Assistant</SelectItem>
            </Select>
            <Input
              size="sm"
              label="Department"
              value={formData.department}
              onValueChange={(value) =>
                setFormData({ ...formData, department: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Schedule"
              value={formData.schedule}
              onValueChange={(value) =>
                setFormData({ ...formData, schedule: value })
              }
              variant="bordered"
              placeholder="Mon-Fri 9AM-5PM"
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
              {mode === "edit" ? "Update" : "Add"} Staff Member
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
