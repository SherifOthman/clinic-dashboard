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

interface Bill {
  id: string;
  patientName: string;
  totalAmount: number;
  balanceAmount: number;
}

interface BillingFormData {
  paymentAmount: string;
}

interface BillingModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "payment";
  bill?: Bill;
  onSave: (data?: BillingFormData) => void;
  isLoading?: boolean;
}

export function BillingModal({
  isOpen,
  onClose,
  mode,
  bill,
  onSave,
  isLoading = false,
}: BillingModalProps) {
  const [paymentAmount, setPaymentAmount] = useState("");

  useEffect(() => {
    if (mode === "payment") {
      setPaymentAmount("");
    }
  }, [mode, isOpen]);

  const handleSave = () => {
    if (mode === "payment") {
      onSave({ paymentAmount });
    } else {
      onSave();
    }
  };

  const getTitle = () => {
    return mode === "payment" ? "Record Payment" : "Create Invoice";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalContent>
        <ModalHeader>{getTitle()}</ModalHeader>
        <ModalBody>
          {mode === "payment" ? (
            <div className="space-y-3">
              <Input
                size="sm"
                label="Patient"
                value={bill?.patientName || ""}
                isReadOnly
                variant="bordered"
              />
              <Input
                size="sm"
                label="Total Amount"
                value={`${bill?.totalAmount?.toFixed(2) || "0.00"}`}
                isReadOnly
                variant="bordered"
              />
              <Input
                size="sm"
                label="Balance Due"
                value={`${bill?.balanceAmount?.toFixed(2) || "0.00"}`}
                isReadOnly
                variant="bordered"
              />
              <Input
                size="sm"
                label="Payment Amount"
                type="number"
                step="0.01"
                value={paymentAmount}
                onValueChange={setPaymentAmount}
                variant="bordered"
                startContent="$"
                placeholder="0.00"
              />
            </div>
          ) : (
            <div className="text-center py-4">
              <p>Quick invoice creation for demonstration.</p>
              <p className="text-sm text-default-500 mt-2">
                This will create a sample invoice for a new patient.
              </p>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isLoading}>
            {mode === "payment" ? "Record Payment" : "Create Invoice"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
