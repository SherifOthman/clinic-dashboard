import { DataTable } from "@/components/ui/DataTable";
import { GENDER_COLORS } from "@/lib/constants";
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
  AlertTriangle,
  Edit,
  Mail,
  MoreVertical,
  Phone,
  Trash2,
} from "lucide-react";

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  gender: "male" | "female" | "other";
  bloodType: string;
  allergies: string[];
  emergencyContact: string;
  emergencyPhone: string;
  medicalNotes: string;
  lastVisit: string;
}

interface PatientsTableProps {
  patients: Patient[];
  isLoading?: boolean;
  onEdit: (patient: Patient) => void;
  onDelete: (id: string) => void;
  onView: (patient: Patient) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const columns = [
  { key: "patient", label: "PATIENT", minWidth: "200px" },
  { key: "contact", label: "CONTACT", minWidth: "180px" },
  { key: "medical", label: "MEDICAL INFO", minWidth: "160px" },
  { key: "emergency", label: "EMERGENCY", minWidth: "160px" },
  { key: "lastVisit", label: "LAST VISIT", minWidth: "120px" },
  { key: "actions", label: "ACTIONS", width: "80px" },
];

export function PatientsTable({
  patients,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  page = 1,
  pageSize = 10,
  onPageChange,
}: PatientsTableProps) {
  const calculateAge = (dateOfBirth: string) => {
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }
    return age;
  };

  const renderCell = (patient: Patient, columnKey: string) => {
    switch (columnKey) {
      case "patient":
        return (
          <div className="flex items-center gap-3">
            <Avatar
              src={`https://i.pravatar.cc/150?u=${patient.email}`}
              size="sm"
            />
            <div className="flex flex-col">
              <span className="font-medium">
                {patient.firstName} {patient.lastName}
              </span>
              <div className="flex items-center gap-2">
                <span className="text-xs text-default-500">
                  {calculateAge(patient.dateOfBirth)} years old
                </span>
                <Chip
                  size="sm"
                  variant="flat"
                  color={GENDER_COLORS[patient.gender]}
                >
                  {patient.gender}
                </Chip>
              </div>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Phone size={12} className="text-default-400" />
              <span className="text-sm">{patient.phone}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Mail size={12} className="text-default-400" />
              <span className="text-xs text-default-500 truncate max-w-[140px]">
                {patient.email}
              </span>
            </div>
          </div>
        );
      case "medical":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              Type {patient.bloodType}
            </span>
            {patient.allergies.length > 0 && (
              <div className="flex items-center gap-1 mt-1">
                <AlertTriangle size={12} className="text-warning" />
                <span className="text-xs text-warning">
                  {patient.allergies.length} allergies
                </span>
              </div>
            )}
          </div>
        );
      case "emergency":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium truncate max-w-[120px]">
              {patient.emergencyContact}
            </span>
            <span className="text-xs text-default-500">
              {patient.emergencyPhone}
            </span>
          </div>
        );
      case "lastVisit":
        return <span className="text-sm">{patient.lastVisit}</span>;
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
                onPress={() => onEdit(patient)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(patient.id)}
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
      data={patients}
      isLoading={isLoading}
      renderCell={renderCell}
      emptyContent="No patients found"
      onRowClick={onView}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
}
