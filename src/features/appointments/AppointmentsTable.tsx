import { DataTable } from "@/components/ui/DataTable";
import { APPOINTMENT_TYPE_COLORS, STATUS_COLORS } from "@/lib/constants";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import {
  Calendar,
  Clock,
  DollarSign,
  Edit,
  MoreVertical,
  Trash2,
  User,
} from "lucide-react";

interface Appointment {
  id: string;
  patient: string;
  doctor: string;
  date: string;
  time: string;
  type: "consultation" | "follow-up" | "emergency" | "checkup";
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  price: number;
  notes?: string;
}

interface AppointmentsTableProps {
  appointments: Appointment[];
  isLoading?: boolean;
  onEdit: (appointment: Appointment) => void;
  onDelete: (id: string) => void;
  onView: (appointment: Appointment) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const columns = [
  { key: "datetime", label: "DATE & TIME", minWidth: "160px" },
  { key: "patient", label: "PATIENT", minWidth: "150px" },
  { key: "doctor", label: "DOCTOR", minWidth: "150px" },
  { key: "type", label: "TYPE", minWidth: "120px" },
  { key: "status", label: "STATUS", minWidth: "120px" },
  { key: "price", label: "PRICE", minWidth: "100px" },
  { key: "actions", label: "ACTIONS", width: "80px" },
];

export function AppointmentsTable({
  appointments,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  page = 1,
  pageSize = 10,
  onPageChange,
}: AppointmentsTableProps) {
  const renderCell = (appointment: Appointment, columnKey: string) => {
    switch (columnKey) {
      case "datetime":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Calendar size={12} className="text-default-400" />
              <span className="font-medium text-sm">{appointment.date}</span>
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock size={12} className="text-default-400" />
              <span className="text-xs text-default-500">
                {appointment.time}
              </span>
            </div>
          </div>
        );
      case "patient":
        return (
          <div className="flex items-center gap-1">
            <User size={12} className="text-default-400" />
            <span className="font-medium">{appointment.patient}</span>
          </div>
        );
      case "doctor":
        return <span className="text-sm">{appointment.doctor}</span>;
      case "type":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={APPOINTMENT_TYPE_COLORS[appointment.type]}
          >
            {appointment.type}
          </Chip>
        );
      case "status":
        return (
          <Chip
            color={STATUS_COLORS[appointment.status]}
            size="sm"
            variant="flat"
          >
            {appointment.status}
          </Chip>
        );
      case "price":
        return (
          <div className="flex items-center gap-1">
            <DollarSign size={12} className="text-default-400" />
            <span className="font-medium">${appointment.price}</span>
          </div>
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
                onPress={() => onEdit(appointment)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(appointment.id)}
              >
                Cancel
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
      data={appointments}
      isLoading={isLoading}
      renderCell={renderCell}
      emptyContent="No appointments found"
      onRowClick={onView}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
}
