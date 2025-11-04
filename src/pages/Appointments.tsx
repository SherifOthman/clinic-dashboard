import { FilterBar } from "@/components/ui/FilterBar";
import {
  AppointmentModal,
  AppointmentsTable,
  mockAppointments,
} from "@/features/appointments";
import { Button } from "@heroui/button";
import { Select, SelectItem } from "@heroui/select";
import { Filter, Plus } from "lucide-react";
import { useState } from "react";

export default function Appointments() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "view">("add");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [appointments, setAppointments] = useState(mockAppointments);

  const handleCreate = () => {
    setModalType("add");
    setSelectedAppointment(null);
    setIsModalOpen(true);
  };

  const handleEdit = (appointment: any) => {
    setModalType("edit");
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleView = (appointment: any) => {
    setModalType("view");
    setSelectedAppointment(appointment);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedAppointment) {
        setAppointments(
          appointments.map((a) =>
            a.id === selectedAppointment.id
              ? { ...a, ...formData, type: formData.type as any }
              : a
          )
        );
      } else {
        const newAppointment = {
          id: `${appointments.length + 1}`,
          ...formData,
          type: formData.type as any,
          status: "scheduled" as const,
          price: 150,
        };
        setAppointments([...appointments, newAppointment]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setAppointments(appointments.filter((a) => a.id !== id));
  };

  const filteredAppointments = appointments.filter((appointment) => {
    const matchesSearch =
      appointment.patient.toLowerCase().includes(search.toLowerCase()) ||
      appointment.doctor.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = !statusFilter || appointment.status === statusFilter;
    const matchesType = !typeFilter || appointment.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Appointments</h1>
          <p className="text-sm text-default-500">
            Schedule and manage patient appointments
          </p>
        </div>
        <Button
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
          className="shadow-sm"
        >
          Schedule Appointment
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        searchValue={search}
        onSearchChange={setSearch}
        searchPlaceholder="Search by patient or doctor name..."
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
          <SelectItem key="scheduled">Scheduled</SelectItem>
          <SelectItem key="confirmed">Confirmed</SelectItem>
          <SelectItem key="completed">Completed</SelectItem>
          <SelectItem key="cancelled">Cancelled</SelectItem>
        </Select>
        <Select
          className="max-w-xs"
          variant="bordered"
          selectedKeys={typeFilter ? [typeFilter] : []}
          onChange={(e) => setTypeFilter(e.target.value)}
          placeholder="Filter by type"
        >
          <SelectItem key="">All Types</SelectItem>
          <SelectItem key="consultation">Consultation</SelectItem>
          <SelectItem key="follow-up">Follow-up</SelectItem>
          <SelectItem key="emergency">Emergency</SelectItem>
          <SelectItem key="checkup">Checkup</SelectItem>
        </Select>
      </FilterBar>

      {/* Table */}
      <AppointmentsTable
        appointments={filteredAppointments}
        isLoading={isLoading}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onView={handleView}
        page={page}
        onPageChange={setPage}
      />

      <AppointmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={modalType}
        appointment={selectedAppointment}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
