import { FilterBar } from "@/components/ui/FilterBar";
import { mockStaff, StaffModal } from "@/features/staff";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import { Clock, Filter, Mail, Phone, Plus, UserCheck } from "lucide-react";
import { useState } from "react";

const roleColorMap = {
  nurse: "success",
  receptionist: "primary",
  "lab-technician": "warning",
  pharmacist: "secondary",
  "medical-assistant": "default",
  security: "warning",
  "it-support": "primary",
  "billing-specialist": "secondary",
  "social-worker": "default",
} as const;

export default function Staff() {
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [staff, setStaff] = useState(mockStaff);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any>(null);

  const handleCreate = () => {
    setSelectedStaff(null);
    setIsModalOpen(true);
  };

  const handleEdit = (staffMember: any) => {
    setSelectedStaff(staffMember);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedStaff) {
        setStaff(
          staff.map((s) =>
            s.id === selectedStaff.id
              ? { ...s, ...formData, role: formData.role as any }
              : s
          )
        );
      } else {
        const newStaff = {
          id: `staff${staff.length + 1}`,
          ...formData,
          role: formData.role as any,
          employeeId: `EMP${String(staff.length + 1).padStart(3, "0")}`,
          hireDate: new Date().toISOString().split("T")[0],
          shift: "day" as const,
          status: "active" as const,
        };

        setStaff([...staff, newStaff]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleDelete = (id: string) => {
    setStaff(staff.filter((s) => s.id !== id));
  };

  const filteredStaff = staff.filter((staffMember) => {
    const matchesSearch =
      staffMember.firstName.toLowerCase().includes(search.toLowerCase()) ||
      staffMember.lastName.toLowerCase().includes(search.toLowerCase()) ||
      staffMember.email.toLowerCase().includes(search.toLowerCase()) ||
      staffMember.role.toLowerCase().includes(search.toLowerCase());
    const matchesRole = !roleFilter || staffMember.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Staff</h1>
          <p className="text-sm text-default-500">
            Manage clinic staff and their schedules
          </p>
        </div>
        <Button
          className="shadow-sm"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Add Staff Member
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <UserCheck className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Staff</p>
              <p className="text-xl font-bold">{mockStaff.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <Clock className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">On Duty</p>
              <p className="text-xl font-bold">
                {mockStaff.filter((s) => s.status === "active").length}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <UserCheck className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Nurses</p>
              <p className="text-xl font-bold">
                {mockStaff.filter((s) => s.role === "nurse").length}
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <UserCheck className="text-orange-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Departments</p>
              <p className="text-xl font-bold">
                {new Set(mockStaff.map((s) => s.department)).size}
              </p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search staff by name, email, or role..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select
          className="max-w-xs"
          placeholder="Filter by role"
          selectedKeys={roleFilter ? [roleFilter] : []}
          startContent={<Filter size={18} />}
          variant="bordered"
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <SelectItem key="">All Roles</SelectItem>
          <SelectItem key="nurse">Nurse</SelectItem>
          <SelectItem key="receptionist">Receptionist</SelectItem>
          <SelectItem key="lab-technician">Lab Technician</SelectItem>
        </Select>
      </FilterBar>

      {/* Staff Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredStaff.map((staff) => (
          <Card
            key={staff.id}
            className="shadow-sm border border-divider hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="md"
                    src={`https://i.pravatar.cc/150?u=${staff.email}`}
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">
                      {staff.firstName} {staff.lastName}
                    </h3>
                    <p className="text-sm text-default-500">
                      {staff.department}
                    </p>
                  </div>
                </div>
                <Chip color={roleColorMap[staff.role]} size="sm" variant="flat">
                  {staff.role.replace("-", " ")}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="text-default-400" size={14} />
                  <span className="text-default-600 truncate">
                    {staff.email}
                  </span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="text-default-400" size={14} />
                  <span className="text-default-600">{staff.phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Clock className="text-default-400" size={14} />
                  <span className="text-default-600">{staff.schedule}</span>
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-divider">
                <Button
                  size="sm"
                  variant="bordered"
                  onPress={() => handleEdit(staff)}
                >
                  Edit
                </Button>
                <Button
                  color="danger"
                  size="sm"
                  variant="light"
                  onPress={() => handleDelete(staff.id)}
                >
                  Remove
                </Button>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <StaffModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        mode={selectedStaff ? "edit" : "add"}
        staff={selectedStaff}
        onSave={handleSave}
        isLoading={isLoading}
      />
    </div>
  );
}
