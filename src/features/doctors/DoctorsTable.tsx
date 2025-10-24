import { DataTable } from "@/components/ui/DataTable";
import { STATUS_COLORS } from "@/lib/constants";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Edit,
  GraduationCap,
  Mail,
  MoreVertical,
  Phone,
  Star,
  Stethoscope,
  Trash2,
  User,
} from "lucide-react";

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  specialization: string;
  licenseNumber: string;
  experience: number;
  education: string;
  status: "active" | "inactive" | "on-leave";
  schedule: string;
  patientsCount: number;
  appointmentsToday: number;
  rating: number;
  joinedDate: string;
  clinicId: string;
  clinicName: string;
}

interface DoctorsTableProps {
  doctors: Doctor[];
  isLoading?: boolean;
  onEdit: (doctor: Doctor) => void;
  onDelete: (id: string) => void;
  onView: (doctor: Doctor) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const specializationColorMap: Record<string, any> = {
  Cardiology: "danger",
  Pediatrics: "secondary",
  Orthopedics: "primary",
  Dermatology: "warning",
  Neurology: "success",
  Psychiatry: "default",
  "General Medicine": "primary",
  Gynecology: "secondary",
  Radiology: "default",
  Endocrinology: "warning",
  Ophthalmology: "success",
  Anesthesiology: "danger",
};

const columns = [
  { key: "doctor", label: "DOCTOR", minWidth: "200px" },
  { key: "contact", label: "CONTACT", minWidth: "180px" },
  { key: "specialization", label: "SPECIALIZATION", minWidth: "150px" },
  { key: "clinic", label: "CLINIC", minWidth: "160px" },
  { key: "performance", label: "PERFORMANCE", minWidth: "140px" },
  { key: "status", label: "STATUS", minWidth: "100px" },
  { key: "actions", label: "ACTIONS", width: "80px" },
];

export function DoctorsTable({
  doctors,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  page = 1,
  pageSize = 10,
  onPageChange,
}: DoctorsTableProps) {
  const renderCell = (doctor: Doctor, columnKey: string) => {
    switch (columnKey) {
      case "doctor":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={`https://i.pravatar.cc/150?u=${doctor.email}`}
              size="sm"
            />
            <div className="flex flex-col">
              <span className="font-medium">
                Dr. {doctor.firstName} {doctor.lastName}
              </span>
              <div className="flex items-center gap-1 mt-1">
                <GraduationCap size={12} className="text-default-400" />
                <span className="text-xs text-default-500">
                  {doctor.experience} years exp.
                </span>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Phone size={12} className="text-default-400" />
              <span className="text-sm">{doctor.phone}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Mail size={12} className="text-default-400" />
              <span className="text-xs text-default-500 truncate max-w-[140px]">
                {doctor.email}
              </span>
            </div>
          </div>
        );
      case "specialization":
        return (
          <div className="flex flex-col">
            <Chip
              size="sm"
              variant="flat"
              color={specializationColorMap[doctor.specialization]}
              startContent={<Stethoscope size={12} />}
            >
              {doctor.specialization}
            </Chip>
            <span className="text-xs text-default-500 mt-1">
              License: {doctor.licenseNumber}
            </span>
          </div>
        );
      case "clinic":
        return (
          <div className="flex flex-col">
            <span className="font-medium text-sm truncate max-w-[120px]">
              {doctor.clinicName}
            </span>
            <span className="text-xs text-default-500">{doctor.schedule}</span>
          </div>
        );
      case "performance":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Star size={12} className="text-warning fill-warning" />
              <span className="text-sm font-medium">{doctor.rating}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <User size={12} className="text-default-400" />
              <span className="text-xs text-default-500">
                {doctor.patientsCount} patients
              </span>
            </div>
            <span className="text-xs text-default-500">
              {doctor.appointmentsToday} today
            </span>
          </div>
        );
      case "status":
        return (
          <Chip color={STATUS_COLORS[doctor.status]} size="sm" variant="flat">
            {doctor.status}
          </Chip>
        );
      case "actions":
        return (
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light" data-action-button>
                <MoreVertical size={16} />
              </Button>
            </DropdownTrigger>
            <DropdownMenu aria-label="Actions">
              <DropdownItem
                key="edit"
                startContent={<Edit size={16} />}
                onPress={() => onEdit(doctor)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(doctor.id)}
              >
                Delete
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        );
      default:
        return null;
    }
  };

  return (
    <DataTable
      columns={columns}
      data={doctors}
      isLoading={isLoading}
      renderCell={renderCell}
      emptyContent="No doctors found"
      onRowClick={onView}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
}
