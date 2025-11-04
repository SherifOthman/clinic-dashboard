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

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  status: string;
  price: number;
  notes: string;
}

interface AppointmentFormData {
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: string;
  notes: string;
}

interface AppointmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  appointment?: Appointment;
  onSave: (data: AppointmentFormData) => void;
  isLoading?: boolean;
}

export function AppointmentModal({
  isOpen,
  onClose,
  mode,
  appointment,
  onSave,
  isLoading = false,
}: AppointmentModalProps) {
  const [formData, setFormData] = useState<AppointmentFormData>({
    patient: "",
    doctor: "",
    date: "",
    time: "",
    type: "consultation",
    notes: "",
  });

  useEffect(() => {
    if (appointment && (mode === "edit" || mode === "view")) {
      setFormData({
        patient: appointment.patient,
        doctor: appointment.doctor,
        date: appointment.date,
        time: appointment.time,
        type: appointment.type,
        notes: appointment.notes,
      });
    } else if (mode === "add") {
      setFormData({
        patient: "",
        doctor: "",
        date: "",
        time: "",
        type: "consultation",
        notes: "",
      });
    }
  }, [appointment, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Appointment Details";
      case "edit":
        return "Edit Appointment";
      case "add":
        return "Schedule New Appointment";
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
              label="Patient Name"
              value={formData.patient}
              onValueChange={(value) =>
                setFormData({ ...formData, patient: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Doctor Name"
              value={formData.doctor}
              onValueChange={(value) =>
                setFormData({ ...formData, doctor: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Date"
              type="date"
              value={formData.date}
              onValueChange={(value) =>
                setFormData({ ...formData, date: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Time"
              value={formData.time}
              onValueChange={(value) =>
                setFormData({ ...formData, time: value })
              }
              variant="bordered"
              placeholder="09:00 AM"
              isReadOnly={mode === "view"}
            />
            <Select
              size="sm"
              label="Type"
              selectedKeys={[formData.type]}
              onChange={(e) =>
                setFormData({ ...formData, type: e.target.value })
              }
              variant="bordered"
              isDisabled={mode === "view"}
            >
              <SelectItem key="consultation">Consultation</SelectItem>
              <SelectItem key="follow-up">Follow-up</SelectItem>
              <SelectItem key="emergency">Emergency</SelectItem>
              <SelectItem key="checkup">Checkup</SelectItem>
            </Select>
            <Input
              size="sm"
              label="Notes"
              value={formData.notes}
              onValueChange={(value) =>
                setFormData({ ...formData, notes: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
          </div>
          {mode === "view" && appointment && (
            <div className="mt-4 grid grid-cols-2 gap-4 p-4 bg-default-50 rounded-lg">
              <div>
                <p className="text-sm text-default-500">Status</p>
                <p className="text-lg font-semibold capitalize">
                  {appointment.status}
                </p>
              </div>
              <div>
                <p className="text-sm text-default-500">Price</p>
                <p className="text-lg font-semibold">${appointment.price}</p>
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
              {mode === "edit" ? "Update" : "Schedule"} Appointment
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
