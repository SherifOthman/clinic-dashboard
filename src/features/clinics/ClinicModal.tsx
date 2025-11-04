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

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  subscription: string;
  patientCount?: number;
  dailyAppointments?: number;
}

interface ClinicFormData {
  name: string;
  address: string;
  phone: string;
  email: string;
  subscription: string;
}

interface ClinicModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  clinic?: Clinic;
  onSave: (data: ClinicFormData) => void;
  isLoading?: boolean;
}

export function ClinicModal({
  isOpen,
  onClose,
  mode,
  clinic,
  onSave,
  isLoading = false,
}: ClinicModalProps) {
  const [formData, setFormData] = useState<ClinicFormData>({
    name: "",
    address: "",
    phone: "",
    email: "",
    subscription: "basic",
  });

  useEffect(() => {
    if (clinic && (mode === "edit" || mode === "view")) {
      setFormData({
        name: clinic.name,
        address: clinic.address,
        phone: clinic.phone,
        email: clinic.email,
        subscription: clinic.subscription,
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        address: "",
        phone: "",
        email: "",
        subscription: "basic",
      });
    }
  }, [clinic, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Clinic Details";
      case "edit":
        return "Edit Clinic";
      case "add":
        return "Add New Clinic";
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
              label="Clinic Name"
              value={formData.name}
              onValueChange={(value) =>
                setFormData({ ...formData, name: value })
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
              label="Subscription"
              selectedKeys={[formData.subscription]}
              onChange={(e) =>
                setFormData({ ...formData, subscription: e.target.value })
              }
              variant="bordered"
              isDisabled={mode === "view"}
            >
              <SelectItem key="basic">Basic</SelectItem>
              <SelectItem key="premium">Premium</SelectItem>
              <SelectItem key="enterprise">Enterprise</SelectItem>
            </Select>
            <Input
              size="sm"
              label="Address"
              value={formData.address}
              onValueChange={(value) =>
                setFormData({ ...formData, address: value })
              }
              variant="bordered"
              className="col-span-2"
              isReadOnly={mode === "view"}
            />
          </div>
          {mode === "view" && clinic && (
            <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-default-50 rounded-lg">
              <div>
                <p className="text-sm text-default-500">Patient Count</p>
                <p className="text-lg font-semibold">{clinic.patientCount}</p>
              </div>
              <div>
                <p className="text-sm text-default-500">Daily Appointments</p>
                <p className="text-lg font-semibold">
                  {clinic.dailyAppointments}
                </p>
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
              {mode === "edit" ? "Update" : "Add"} Clinic
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
