import { Button } from "@heroui/button";
import { Input, Textarea } from "@heroui/input";
import {
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/modal";
import { useEffect, useState } from "react";

interface MedicalRecord {
  id: string;
  patientName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  vitals?: {
    bloodPressure: string;
    heartRate: number;
    temperature: number;
  };
}

interface MedicalRecordFormData {
  patientName: string;
  diagnosis: string;
  treatment: string;
  notes: string;
  bloodPressure: string;
  heartRate: string;
  temperature: string;
}

interface MedicalRecordModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "edit" | "view";
  record?: MedicalRecord;
  onSave: (data: MedicalRecordFormData) => void;
  isLoading?: boolean;
}

export function MedicalRecordModal({
  isOpen,
  onClose,
  mode,
  record,
  onSave,
  isLoading = false,
}: MedicalRecordModalProps) {
  const [formData, setFormData] = useState<MedicalRecordFormData>({
    patientName: "",
    diagnosis: "",
    treatment: "",
    notes: "",
    bloodPressure: "",
    heartRate: "",
    temperature: "",
  });

  useEffect(() => {
    if (record && (mode === "edit" || mode === "view")) {
      setFormData({
        patientName: record.patientName,
        diagnosis: record.diagnosis,
        treatment: record.treatment,
        notes: record.notes,
        bloodPressure: record.vitals?.bloodPressure || "",
        heartRate: record.vitals?.heartRate?.toString() || "",
        temperature: record.vitals?.temperature?.toString() || "",
      });
    } else if (mode === "add") {
      setFormData({
        patientName: "",
        diagnosis: "",
        treatment: "",
        notes: "",
        bloodPressure: "",
        heartRate: "",
        temperature: "",
      });
    }
  }, [record, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    switch (mode) {
      case "view":
        return "Medical Record Details";
      case "edit":
        return "Edit Medical Record";
      case "add":
        return "Add New Medical Record";
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
              value={formData.patientName}
              onValueChange={(value) =>
                setFormData({ ...formData, patientName: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Diagnosis"
              value={formData.diagnosis}
              onValueChange={(value) =>
                setFormData({ ...formData, diagnosis: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Blood Pressure"
              value={formData.bloodPressure}
              onValueChange={(value) =>
                setFormData({ ...formData, bloodPressure: value })
              }
              variant="bordered"
              placeholder="120/80"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Heart Rate"
              type="number"
              value={formData.heartRate}
              onValueChange={(value) =>
                setFormData({ ...formData, heartRate: value })
              }
              variant="bordered"
              placeholder="72"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Temperature (°F)"
              type="number"
              step="0.1"
              value={formData.temperature}
              onValueChange={(value) =>
                setFormData({ ...formData, temperature: value })
              }
              variant="bordered"
              placeholder="98.6"
              isReadOnly={mode === "view"}
            />
            <Input
              size="sm"
              label="Treatment"
              value={formData.treatment}
              onValueChange={(value) =>
                setFormData({ ...formData, treatment: value })
              }
              variant="bordered"
              isReadOnly={mode === "view"}
            />
            <Textarea
              size="sm"
              label="Notes"
              value={formData.notes}
              onValueChange={(value) =>
                setFormData({ ...formData, notes: value })
              }
              variant="bordered"
              className="col-span-2"
              placeholder="Additional notes and observations..."
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
              {mode === "edit" ? "Update" : "Add"} Record
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
