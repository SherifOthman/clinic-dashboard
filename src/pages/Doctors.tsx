import { FilterBar } from "@/components/ui/FilterBar";
import { DoctorModal, DoctorsTable, mockDoctors } from "@/features/doctors";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

export default function Doctors() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [specializationFilter, setSpecializationFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [doctors, setDoctors] = useState(mockDoctors);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDoctor, setSelectedDoctor] = useState<any>(null);

  const handleCreate = () => {
    setSelectedDoctor(null);
    setIsModalOpen(true);
  };

  const handleEdit = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleView = (doctor: any) => {
    setSelectedDoctor(doctor);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedDoctor) {
        setDoctors(
          doctors.map((d) =>
            d.id === selectedDoctor.id ? { ...d, ...formData } : d
          )
        );
      } else {
        const newDoctor = {
          id: `doc${doctors.length + 1}`,
          ...formData,
          department: "General Medicine",
          status: "active" as const,
          availability: "Available",
          rating: 4.5,
          consultationFee: 150,
        };
        setDoctors([...doctors, newDoctor]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setDoctors(doctors.filter((d) => d.id !== id));
  };

  const filteredDoctors = doctors.filter((doctor) => {
    const matchesSearch =
      doctor.firstName.toLowerCase().includes(search.toLowerCase()) ||
      doctor.lastName.toLowerCase().includes(search.toLowerCase()) ||
      doctor.email.toLowerCase().includes(search.toLowerCase()) ||
      doctor.specialization.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || doctor.status === statusFilter;
    const matchesSpecialization =
      !specializationFilter || doctor.specialization === specializationFilter;
    return matchesSearch && matchesStatus && matchesSpecialization;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Doctors</h1>
          <p className="text-sm text-default-500">
            Manage doctor profiles and schedules
          </p>
        </div>
        <Button
          className="shadow-sm"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Add Doctor
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search by name, email, or specialization..."
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
          <SelectItem key="active">Active</SelectItem>
          <SelectItem key="inactive">Inactive</SelectItem>
        </Select>
        <Select
          className="max-w-xs"
          placeholder="Filter by specialization"
          selectedKeys={specializationFilter ? [specializationFilter] : []}
          variant="bordered"
          onChange={(e) => setSpecializationFilter(e.target.value)}
        >
          <SelectItem key="">All Specializations</SelectItem>
          <SelectItem key="Cardiology">Cardiology</SelectItem>
          <SelectItem key="Neurology">Neurology</SelectItem>
          <SelectItem key="Pediatrics">Pediatrics</SelectItem>
        </Select>
      </FilterBar>

      {/* Table */}
      <DoctorsTable
        doctors={filteredDoctors}
        isLoading={isLoading}
        page={page}
        onDelete={handleDelete}
        onEdit={handleEdit}
        onPageChange={setPage}
        onView={handleView}
      />

      <DoctorModal
        doctor={selectedDoctor}
        isLoading={isLoading}
        isOpen={isModalOpen}
        mode={selectedDoctor ? "edit" : "add"}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
