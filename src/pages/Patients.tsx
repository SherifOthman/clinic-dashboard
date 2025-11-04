import { FilterBar } from "@/components/ui/FilterBar";
import { PatientModal, PatientsTable, mockPatients } from "@/features/patients";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

export default function Patients() {
  const [search, setSearch] = useState("");
  const [genderFilter, setGenderFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [patients, setPatients] = useState(mockPatients);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "view">("add");
  const [selectedPatient, setSelectedPatient] = useState<any>(null);

  const handleCreate = () => {
    setModalType("add");
    setSelectedPatient(null);
    setIsModalOpen(true);
  };

  const handleEdit = (patient: any) => {
    setModalType("edit");
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleView = (patient: any) => {
    setModalType("view");
    setSelectedPatient(patient);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedPatient) {
        setPatients(
          patients.map((p) =>
            p.id === selectedPatient.id
              ? {
                  ...p,
                  ...formData,
                  gender: formData.gender as "male" | "female",
                }
              : p
          )
        );
      } else {
        const newPatient = {
          id: `${patients.length + 1}`,
          ...formData,
          gender: formData.gender as "male" | "female",
          allergies: [],
          medicalNotes: "New patient - initial consultation needed",
          lastVisit: new Date().toISOString().split("T")[0],
        };
        setPatients([...patients, newPatient]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setPatients(patients.filter((p) => p.id !== id));
  };

  const filteredPatients = patients.filter((patient) => {
    const matchesSearch =
      patient.firstName.toLowerCase().includes(search.toLowerCase()) ||
      patient.lastName.toLowerCase().includes(search.toLowerCase()) ||
      patient.email.toLowerCase().includes(search.toLowerCase()) ||
      patient.phone.includes(search);
    const matchesGender = !genderFilter || patient.gender === genderFilter;
    return matchesSearch && matchesGender;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Patients</h1>
          <p className="text-sm text-default-500">
            Manage patient records and medical information
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
          className="shadow-sm"
        >
          Add Patient
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by name, email, or phone..."
      >
        <Select
          className="max-w-xs"
          variant="bordered"
          selectedKeys={genderFilter ? [genderFilter] : []}
          onChange={(e) => setGenderFilter(e.target.value)}
          startContent={<Filter size={18} />}
          placeholder="Filter by gender"
        >
          <SelectItem key="">All Genders</SelectItem>
          <SelectItem key="male">Male</SelectItem>
          <SelectItem key="female">Female</SelectItem>
        </Select>
      </FilterBar>

      {/* Table */}
      <PatientsTable
        patients={filteredPatients}
        isLoading={false}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        onPageChange={setPage}
      />

      <PatientModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalType}
        patient={selectedPatient}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
