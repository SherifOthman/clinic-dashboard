import { FilterBar } from "@/components/ui/FilterBar";
import { InventoryModal, mockInventoryItems } from "@/features/inventory";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { AlertTriangle, Filter, Package, Plus, TrendingUp } from "lucide-react";
import { useState } from "react";

const categoryColorMap = {
  "Medical Supplies": "primary",
  Equipment: "success",
  Furniture: "warning",
  "Office Supplies": "secondary",
} as const;

const statusColorMap = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "danger",
  critical: "danger",
} as const;

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [items, setItems] = useState(mockInventoryItems);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "restock">("add");
  const [selectedItem, setSelectedItem] = useState<any>(null);

  const handleCreate = () => {
    setModalType("add");
    setSelectedItem(null);
    setIsModalOpen(true);
  };

  const handleRestock = (item: any) => {
    setModalType("restock");
    setSelectedItem(item);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (modalType === "restock" && selectedItem) {
        setItems(
          items.map((item) =>
            item.id === selectedItem.id
              ? {
                  ...item,
                  currentStock:
                    item.currentStock + Number(formData.restockAmount || 0),
                  lastRestocked: new Date().toISOString().split("T")[0],
                  status: "in-stock" as const,
                }
              : item
          )
        );
      } else {
        const newItem = {
          id: `inv${items.length + 1}`,
          name: formData.name,
          category: formData.category as any,
          currentStock: Number(formData.currentStock) || 0,
          minStock: Number(formData.minStock) || 0,
          maxStock: Number(formData.maxStock) || 0,
          unit: formData.unit,
          costPerUnit: Number(formData.costPerUnit) || 0,
          supplier: formData.supplier,
          lastRestocked: new Date().toISOString().split("T")[0],
          expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          location: formData.location,
          status: "in-stock" as const,
        };

        setItems([...items, newItem]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };
  const handleDelete = (id: string) => {
    setItems(items.filter((item) => item.id !== id));
  };

  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.supplier.toLowerCase().includes(search.toLowerCase()) ||
      item.location.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = !categoryFilter || item.category === categoryFilter;
    const matchesStatus = !statusFilter || item.status === statusFilter;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  const totalValue = mockInventoryItems.reduce(
    (sum, item) => sum + item.currentStock * item.costPerUnit,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventory</h1>
          <p className="text-sm text-default-500">
            Track medical supplies and equipment
          </p>
        </div>
        <Button
          className="shadow-sm"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Add Item
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <Package className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Items</p>
              <p className="text-xl font-bold">{mockInventoryItems.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
              <AlertTriangle className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Low Stock</p>
              <p className="text-xl font-bold">
                {
                  mockInventoryItems.filter(
                    (item) => item.currentStock <= item.minStock
                  ).length
                }
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <TrendingUp className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Value</p>
              <p className="text-xl font-bold">
                ${totalValue.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <Package className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Categories</p>
              <p className="text-xl font-bold">
                {new Set(mockInventoryItems.map((item) => item.category)).size}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search by item name, supplier, or location..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select
          className="max-w-xs"
          placeholder="Filter by category"
          selectedKeys={categoryFilter ? [categoryFilter] : []}
          startContent={<Filter size={18} />}
          variant="bordered"
          onChange={(e) => setCategoryFilter(e.target.value)}
        >
          <SelectItem key="">All Categories</SelectItem>
          <SelectItem key="Medical Supplies">Medical Supplies</SelectItem>
          <SelectItem key="Equipment">Equipment</SelectItem>
          <SelectItem key="Furniture">Furniture</SelectItem>
        </Select>
        <Select
          className="max-w-xs"
          placeholder="Filter by status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          variant="bordered"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <SelectItem key="">All Status</SelectItem>
          <SelectItem key="in-stock">In Stock</SelectItem>
          <SelectItem key="low-stock">Low Stock</SelectItem>
          <SelectItem key="out-of-stock">Out of Stock</SelectItem>
        </Select>
      </FilterBar>

      {/* Inventory Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card
            key={item.id}
            className="shadow-sm border border-divider hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-start justify-between w-full">
                <div>
                  <h3 className="font-semibold">{item.name}</h3>
                  <p className="text-sm text-default-500">{item.supplier}</p>
                </div>
                <div className="flex flex-col gap-1">
                  <Chip
                    color={categoryColorMap[item.category]}
                    size="sm"
                    variant="flat"
                  >
                    {item.category}
                  </Chip>
                  <Chip
                    color={statusColorMap[item.status]}
                    size="sm"
                    variant="flat"
                  >
                    {item.status.replace("-", " ")}
                  </Chip>
                </div>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-xs text-default-500">Current Stock</p>
                    <p className="text-lg font-bold">
                      {item.currentStock} {item.unit}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-default-500">Min Stock</p>
                    <p className="text-sm font-medium">
                      {item.minStock} {item.unit}
                    </p>
                  </div>
                </div>

                <div className="w-full bg-default-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${
                      item.currentStock <= item.minStock
                        ? "bg-danger"
                        : item.currentStock <= item.minStock * 2
                          ? "bg-warning"
                          : "bg-success"
                    }`}
                    style={{
                      width: `${Math.min((item.currentStock / item.maxStock) * 100, 100)}%`,
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-xs">
                    <span className="text-default-500">Total value:</span>
                    <span className="font-medium">
                      ${(item.currentStock * item.costPerUnit).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span className="text-default-500">Location:</span>
                    <span className="font-medium truncate max-w-[120px]">
                      {item.location}
                    </span>
                  </div>
                  {item.expiryDate && (
                    <div className="flex justify-between text-xs">
                      <span className="text-default-500">Expires:</span>
                      <span className="font-medium">{item.expiryDate}</span>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 pt-3">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => handleRestock(item)}
                  >
                    Restock
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => handleDelete(item.id)}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <InventoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalType}
        item={selectedItem}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
