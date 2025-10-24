import { FilterBar } from "@/components/ui/FilterBar";
import { BillingModal, mockBillingRecords } from "@/features/billing";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  AlertCircle,
  CreditCard,
  DollarSign,
  Filter,
  Plus,
} from "lucide-react";
import { useState } from "react";

const statusColorMap = {
  paid: "success",
  pending: "warning",
  overdue: "danger",
  partial: "secondary",
} as const;

export default function Billing() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [paymentMethodFilter, setPaymentMethodFilter] = useState("");
  const [bills, setBills] = useState(mockBillingRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"create" | "payment">("create");
  const [selectedBill, setSelectedBill] = useState<any>(null);

  const handleCreate = () => {
    setModalType("create");
    setIsModalOpen(true);
  };

  const handleCreateBill = () => {
    setIsLoading(true);
    setTimeout(() => {
      const newBill = {
        id: `bill${bills.length + 1}`,
        patientId: "1",
        patientName: "New Patient",
        appointmentId: "1",
        invoiceNumber: `INV-2024-${String(bills.length + 1).padStart(3, "0")}`,
        date: new Date().toISOString().split("T")[0],
        dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          .toISOString()
          .split("T")[0],
        services: [
          {
            code: "99213",
            description: "Office Visit - New Patient",
            quantity: 1,
            unitPrice: 150.0,
            total: 150.0,
          },
        ],
        subtotal: 150.0,
        tax: 0.0,
        discount: 0.0,
        totalAmount: 150.0,
        paidAmount: 0.0,
        balanceAmount: 150.0,
        paymentMethod: "pending" as const,
        insuranceProvider: "Self-pay",
        insuranceClaimId: "SELF-PAY-001",
        status: "pending" as const,
        notes: "New invoice created",
      };
      setBills([...bills, newBill]);
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };
  const handlePayment = (bill: any) => {
    setModalType("payment");
    setSelectedBill(bill);
    setIsModalOpen(true);
  };

  const handleProcessPayment = (formData: any) => {
    if (
      selectedBill &&
      formData.paymentAmount &&
      !isNaN(Number(formData.paymentAmount))
    ) {
      setIsLoading(true);
      setTimeout(() => {
        setBills(
          bills.map((bill: any) => {
            if (bill.id === selectedBill.id) {
              const newPaidAmount =
                bill.paidAmount + Number(formData.paymentAmount);
              const newBalanceAmount = bill.totalAmount - newPaidAmount;
              return {
                ...bill,
                paidAmount: newPaidAmount,
                balanceAmount: newBalanceAmount,
                status:
                  newBalanceAmount <= 0
                    ? ("paid" as const)
                    : ("partial" as const),
              };
            }
            return bill;
          })
        );
        setIsLoading(false);
        setIsModalOpen(false);
      }, 500);
    }
  };

  const handleSave = (formData?: any) => {
    if (modalType === "payment") {
      handleProcessPayment(formData);
    } else {
      handleCreateBill();
    }
  };

  const handleDelete = (id: string) => {
    setBills(bills.filter((bill) => bill.id !== id));
  };

  const filteredBills = bills.filter((bill) => {
    const matchesSearch =
      bill.patientName.toLowerCase().includes(search.toLowerCase()) ||
      bill.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      (bill.insuranceProvider &&
        bill.insuranceProvider.toLowerCase().includes(search.toLowerCase()));
    const matchesStatus = !statusFilter || bill.status === statusFilter;
    const matchesPaymentMethod =
      !paymentMethodFilter || bill.paymentMethod === paymentMethodFilter;
    return matchesSearch && matchesStatus && matchesPaymentMethod;
  });

  const totalRevenue = mockBillingRecords.reduce(
    (sum, bill) => sum + bill.paidAmount,
    0
  );
  const outstandingAmount = mockBillingRecords.reduce(
    (sum, bill) => sum + bill.balanceAmount,
    0
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Billing</h1>
          <p className="text-sm text-default-500">
            Manage invoices and payment records
          </p>
        </div>
        <Button
          className="shadow-sm"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Create Invoice
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <DollarSign className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Revenue</p>
              <p className="text-xl font-bold">
                ${totalRevenue.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-red-50 dark:bg-red-950 rounded-lg">
              <AlertCircle className="text-red-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Outstanding</p>
              <p className="text-xl font-bold">
                ${outstandingAmount.toLocaleString()}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <CreditCard className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Invoices</p>
              <p className="text-xl font-bold">{mockBillingRecords.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <DollarSign className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Avg Invoice</p>
              <p className="text-xl font-bold">
                $
                {(
                  mockBillingRecords.reduce(
                    (sum, bill) => sum + bill.totalAmount,
                    0
                  ) / mockBillingRecords.length
                ).toFixed(0)}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search by patient, invoice number, or insurance..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select
          className="max-w-xs"
          placeholder="Filter by status"
          selectedKeys={statusFilter ? [statusFilter] : []}
          startContent={<Filter size={18} />}
          variant="bordered"
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <SelectItem key="">All Status</SelectItem>
          <SelectItem key="paid">Paid</SelectItem>
          <SelectItem key="pending">Pending</SelectItem>
          <SelectItem key="overdue">Overdue</SelectItem>
          <SelectItem key="partial">Partial</SelectItem>
        </Select>
        <Select
          className="max-w-xs"
          placeholder="Filter by payment method"
          selectedKeys={paymentMethodFilter ? [paymentMethodFilter] : []}
          variant="bordered"
          onChange={(e) => setPaymentMethodFilter(e.target.value)}
        >
          <SelectItem key="">All Methods</SelectItem>
          <SelectItem key="cash">Cash</SelectItem>
          <SelectItem key="card">Card</SelectItem>
          <SelectItem key="insurance">Insurance</SelectItem>
        </Select>
      </FilterBar>

      {/* Billing Records */}
      <div className="space-y-4">
        {filteredBills.map((bill) => (
          <Card
            key={bill.id}
            className="shadow-sm border border-divider hover:shadow-md transition-shadow"
          >
            <CardBody>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    src={`https://i.pravatar.cc/150?u=${bill.patientName}`}
                  />
                  <div>
                    <h3 className="font-semibold">{bill.patientName}</h3>
                    <p className="text-sm text-default-500">
                      {bill.invoiceNumber}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Chip
                    color={statusColorMap[bill.status]}
                    size="sm"
                    variant="flat"
                  >
                    {bill.status}
                  </Chip>
                  <div className="text-right">
                    <p className="text-lg font-bold">
                      ${bill.totalAmount.toFixed(2)}
                    </p>
                    <p className="text-xs text-default-500">
                      Due: {bill.dueDate}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium mb-2">Services</p>
                  <div className="space-y-1">
                    {bill.services.map((service, index) => (
                      <div key={index} className="text-sm">
                        <span className="font-medium">
                          {service.description}
                        </span>
                        <span className="text-default-500 ml-2">
                          ${service.total.toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Payment Status</p>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Paid:</span>
                      <span className="text-success">
                        ${bill.paidAmount.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Balance:</span>
                      <span
                        className={
                          bill.balanceAmount > 0
                            ? "text-danger"
                            : "text-success"
                        }
                      >
                        ${bill.balanceAmount.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium mb-2">Insurance</p>
                  <div className="space-y-1 text-sm">
                    <p className="font-medium">
                      {bill.insuranceProvider || "Self-pay"}
                    </p>
                    {bill.insuranceClaimId && (
                      <p className="text-default-500">
                        Claim: {bill.insuranceClaimId}
                      </p>
                    )}
                    <p className="text-default-500 capitalize">
                      Method: {bill.paymentMethod.replace("-", " ")}
                    </p>
                  </div>
                </div>
              </div>

              {bill.notes && (
                <div className="mt-4 p-3 bg-default-50 rounded-lg">
                  <p className="text-sm text-default-600">{bill.notes}</p>
                </div>
              )}

              <div className="flex gap-2 pt-3 border-t border-divider">
                <Button
                  color="success"
                  isDisabled={bill.balanceAmount <= 0}
                  size="sm"
                  variant="bordered"
                  onPress={() => handlePayment(bill)}
                >
                  Record Payment
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => handleDelete(bill.id)}
                >
                  Delete
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <BillingModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalType}
        bill={selectedBill}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
