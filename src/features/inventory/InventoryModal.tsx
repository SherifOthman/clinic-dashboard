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

interface InventoryItem {
  id: string;
  name: string;
  category: string;
  currentStock: number;
  minStock: number;
  maxStock: number;
  unit: string;
  costPerUnit: number;
  supplier: string;
  location: string;
}

interface InventoryFormData {
  name: string;
  category: string;
  currentStock: string;
  minStock: string;
  maxStock: string;
  unit: string;
  costPerUnit: string;
  supplier: string;
  location: string;
  restockAmount: string;
}

interface InventoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "add" | "restock";
  item?: InventoryItem;
  onSave: (data: InventoryFormData) => void;
  isLoading?: boolean;
}

export function InventoryModal({
  isOpen,
  onClose,
  mode,
  item,
  onSave,
  isLoading = false,
}: InventoryModalProps) {
  const [formData, setFormData] = useState<InventoryFormData>({
    name: "",
    category: "Medical Supplies",
    currentStock: "",
    minStock: "",
    maxStock: "",
    unit: "pieces",
    costPerUnit: "",
    supplier: "",
    location: "",
    restockAmount: "",
  });

  useEffect(() => {
    if (item && mode === "restock") {
      setFormData({
        ...formData,
        name: item.name,
        restockAmount: "",
      });
    } else if (mode === "add") {
      setFormData({
        name: "",
        category: "Medical Supplies",
        currentStock: "",
        minStock: "",
        maxStock: "",
        unit: "pieces",
        costPerUnit: "",
        supplier: "",
        location: "",
        restockAmount: "",
      });
    }
  }, [item, mode, isOpen]);

  const handleSave = () => {
    onSave(formData);
  };

  const getTitle = () => {
    return mode === "restock" ? "Restock Item" : "Add New Item";
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="2xl">
      <ModalContent>
        <ModalHeader>{getTitle()}</ModalHeader>
        <ModalBody>
          {mode === "restock" ? (
            <div className="space-y-3">
              <Input
                size="sm"
                label="Item Name"
                value={formData.name}
                isReadOnly
                variant="bordered"
              />
              <Input
                size="sm"
                label="Restock Quantity"
                type="number"
                value={formData.restockAmount}
                onValueChange={(value) =>
                  setFormData({ ...formData, restockAmount: value })
                }
                variant="bordered"
                placeholder="Enter quantity to add"
              />
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-3">
              <Input
                size="sm"
                label="Item Name"
                value={formData.name}
                onValueChange={(value) =>
                  setFormData({ ...formData, name: value })
                }
                variant="bordered"
              />
              <Select
                size="sm"
                label="Category"
                selectedKeys={[formData.category]}
                onChange={(e) =>
                  setFormData({ ...formData, category: e.target.value })
                }
                variant="bordered"
              >
                <SelectItem key="Medical Supplies">Medical Supplies</SelectItem>
                <SelectItem key="Equipment">Equipment</SelectItem>
                <SelectItem key="Furniture">Furniture</SelectItem>
                <SelectItem key="Office Supplies">Office Supplies</SelectItem>
              </Select>
              <Input
                size="sm"
                label="Current Stock"
                type="number"
                value={formData.currentStock}
                onValueChange={(value) =>
                  setFormData({ ...formData, currentStock: value })
                }
                variant="bordered"
              />
              <Input
                size="sm"
                label="Min Stock"
                type="number"
                value={formData.minStock}
                onValueChange={(value) =>
                  setFormData({ ...formData, minStock: value })
                }
                variant="bordered"
              />
              <Input
                size="sm"
                label="Max Stock"
                type="number"
                value={formData.maxStock}
                onValueChange={(value) =>
                  setFormData({ ...formData, maxStock: value })
                }
                variant="bordered"
              />
              <Input
                size="sm"
                label="Unit"
                value={formData.unit}
                onValueChange={(value) =>
                  setFormData({ ...formData, unit: value })
                }
                variant="bordered"
                placeholder="pieces, boxes, etc."
              />
              <Input
                size="sm"
                label="Cost per Unit"
                type="number"
                step="0.01"
                value={formData.costPerUnit}
                onValueChange={(value) =>
                  setFormData({ ...formData, costPerUnit: value })
                }
                variant="bordered"
                startContent="$"
              />
              <Input
                size="sm"
                label="Supplier"
                value={formData.supplier}
                onValueChange={(value) =>
                  setFormData({ ...formData, supplier: value })
                }
                variant="bordered"
              />
              <Input
                size="sm"
                label="Location"
                value={formData.location}
                onValueChange={(value) =>
                  setFormData({ ...formData, location: value })
                }
                variant="bordered"
                className="col-span-2"
                placeholder="Storage Room A - Shelf 1"
              />
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button variant="light" onPress={onClose}>
            Cancel
          </Button>
          <Button color="primary" onPress={handleSave} isLoading={isLoading}>
            {mode === "restock" ? "Restock" : "Add Item"}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
