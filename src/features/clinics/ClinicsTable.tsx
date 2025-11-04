import { DataTable } from "@/components/ui/DataTable";
import { STATUS_COLORS, SUBSCRIPTION_COLORS } from "@/lib/constants";
import { Button } from "@heroui/button";
import { Chip } from "@heroui/chip";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";
import { Edit, MapPin, MoreVertical, Phone, Trash2 } from "lucide-react";

interface Clinic {
  id: string;
  name: string;
  address: string;
  phone: string;
  email: string;
  status: "active" | "inactive";
  subscription: "basic" | "premium" | "enterprise";
  patientCount: number;
  dailyAppointments: number;
}

interface ClinicsTableProps {
  clinics: Clinic[];
  isLoading?: boolean;
  onEdit: (clinic: Clinic) => void;
  onDelete: (id: string) => void;
  onView: (clinic: Clinic) => void;
  page?: number;
  pageSize?: number;
  onPageChange?: (page: number) => void;
}

const columns = [
  { key: "clinic", label: "CLINIC", minWidth: "200px" },
  { key: "contact", label: "CONTACT", minWidth: "180px" },
  { key: "subscription", label: "PLAN", minWidth: "120px" },
  { key: "metrics", label: "METRICS", minWidth: "140px" },
  { key: "status", label: "STATUS", minWidth: "100px" },
  { key: "actions", label: "ACTIONS", width: "80px" },
];

export function ClinicsTable({
  clinics,
  isLoading = false,
  onEdit,
  onDelete,
  onView,
  page = 1,
  pageSize = 10,
  onPageChange,
}: ClinicsTableProps) {
  const renderCell = (clinic: Clinic, columnKey: string) => {
    switch (columnKey) {
      case "clinic":
        return (
          <div className="flex flex-col">
            <span className="font-medium">{clinic.name}</span>
            <div className="flex items-center gap-1 mt-1">
              <MapPin size={12} className="text-default-400" />
              <span className="text-xs text-default-500 truncate max-w-[150px]">
                {clinic.address}
              </span>
            </div>
          </div>
        );
      case "contact":
        return (
          <div className="flex flex-col">
            <div className="flex items-center gap-1">
              <Phone size={12} className="text-default-400" />
              <span className="text-sm">{clinic.phone}</span>
            </div>
            <span className="text-xs text-default-500 truncate max-w-[140px]">
              {clinic.email}
            </span>
          </div>
        );
      case "subscription":
        return (
          <Chip
            size="sm"
            variant="flat"
            color={SUBSCRIPTION_COLORS[clinic.subscription]}
          >
            {clinic.subscription}
          </Chip>
        );
      case "metrics":
        return (
          <div className="flex flex-col">
            <span className="text-sm font-medium">
              {clinic.patientCount} patients
            </span>
            <span className="text-xs text-default-500">
              {clinic.dailyAppointments}/day avg
            </span>
          </div>
        );
      case "status":
        return (
          <Chip color={STATUS_COLORS[clinic.status]} size="sm" variant="flat">
            {clinic.status}
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
                onPress={() => onEdit(clinic)}
              >
                Edit
              </DropdownItem>
              <DropdownItem
                key="delete"
                className="text-danger"
                color="danger"
                startContent={<Trash2 size={16} />}
                onPress={() => onDelete(clinic.id)}
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
      data={clinics}
      isLoading={isLoading}
      renderCell={renderCell}
      emptyContent="No clinics found"
      onRowClick={onView}
      page={page}
      pageSize={pageSize}
      onPageChange={onPageChange}
    />
  );
}
