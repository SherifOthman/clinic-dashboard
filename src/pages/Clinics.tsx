import { FilterBar } from "@/components/ui/FilterBar";
import { ClinicModal, ClinicsTable, mockClinics } from "@/features/clinics";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

export default function Clinics() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [clinics, setClinics] = useState(mockClinics);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "view">("add");
  const [selectedClinic, setSelectedClinic] = useState<any>(null);

  const handleCreate = () => {
    setModalType("add");
    setSelectedClinic(null);
    setIsModalOpen(true);
  };

  const handleEdit = (clinic: any) => {
    setModalType("edit");
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const handleView = (clinic: any) => {
    setModalType("view");
    setSelectedClinic(clinic);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedClinic) {
        setClinics(
          clinics.map((c) =>
            c.id === selectedClinic.id
              ? {
                  ...c,
                  ...formData,
                  subscription: formData.subscription as any,
                }
              : c
          )
        );
      } else {
        const newClinic = {
          id: `${clinics.length + 1}`,
          ...formData,
          status: "active" as const,
          subscription: formData.subscription as any,
          patientCount: 0,
          dailyAppointments: 0,
        };
        setClinics([...clinics, newClinic]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setClinics(clinics.filter((c) => c.id !== id));
  };

  const filteredClinics = clinics.filter((clinic) => {
    const matchesSearch =
      clinic.name.toLowerCase().includes(search.toLowerCase()) ||
      clinic.address.toLowerCase().includes(search.toLowerCase()) ||
      clinic.email.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || clinic.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Clinics</h1>
          <p className="text-sm text-default-500">
            Manage clinic locations and settings
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
          className="shadow-sm"
        >
          Add Clinic
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search clinics by name, address, or email..."
      >
        <Select
          className="max-w-xs"
          variant="bordered"
          selectedKeys={statusFilter ? [statusFilter] : []}
          onChange={(e) => setStatusFilter(e.target.value)}
          startContent={<Filter size={18} />}
          placeholder="Filter by status"
        >
          <SelectItem key="">All Status</SelectItem>
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="inactive">Inactive</SelectItem>
        </Select>
      </FilterBar>

      {/* Table */}
      <ClinicsTable
        clinics={filteredClinics}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        onPageChange={setPage}
      />

      <ClinicModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalType}
        clinic={selectedClinic}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
