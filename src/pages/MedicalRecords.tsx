import { FilterBar } from "@/components/ui/FilterBar";
import {
  MedicalRecordModal,
  mockLabTests,
  mockMedicalRecords,
  mockPrescriptions,
} from "@/features/medical-records";
import { Avatar } from "@heroui/avatar";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  Calendar,
  FileText,
  Filter,
  Plus,
  Stethoscope,
  TestTube,
} from "lucide-react";
import { useState } from "react";

export default function MedicalRecords() {
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [records, setRecords] = useState(mockMedicalRecords);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState<any>(null);

  const handleCreate = () => {
    setSelectedRecord(null);
    setIsModalOpen(true);
  };

  const handleSave = (formData: any) => {
    setIsLoading(true);
    setTimeout(() => {
      if (selectedRecord) {
        setRecords(
          records.map((r) =>
            r.id === selectedRecord.id ? { ...r, ...formData } : r
          )
        );
      } else {
        const newRecord = {
          id: `mr${records.length + 1}`,
          patientId: "1",
          patientName: formData.patientName,
          recordType: "consultation" as const,
          date: new Date().toISOString().split("T")[0],
          doctorId: "doc1",
          doctorName: "Dr. John Smith",
          diagnosis: formData.diagnosis,
          symptoms: ["General checkup"],
          treatment: formData.treatment,
          prescriptions: [],
          vitals: {
            bloodPressure: formData.bloodPressure || "120/80",
            heartRate: parseInt(formData.heartRate) || 72,
            temperature: parseFloat(formData.temperature) || 98.6,
            weight: 150,
            height: "5'8\"",
          },
          notes: formData.notes,
          followUpDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
            .toISOString()
            .split("T")[0],
          status: "active" as const,
        };
        setRecords([...records, newRecord]);
      }
      setIsLoading(false);
      setIsModalOpen(false);
    }, 500);
  };

  const handleEdit = (record: any) => {
    setSelectedRecord(record);
    setIsModalOpen(true);
  };

  const handleDelete = (id: string) => {
    setRecords(records.filter((r) => r.id !== id));
  };

  const filteredRecords = records.filter((record) => {
    const matchesSearch =
      record.patientName.toLowerCase().includes(search.toLowerCase()) ||
      record.doctorName.toLowerCase().includes(search.toLowerCase()) ||
      record.diagnosis.toLowerCase().includes(search.toLowerCase());
    const matchesType = !typeFilter || record.recordType === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Medical Records</h1>
          <p className="text-sm text-default-500">
            Patient medical history and records
          </p>
        </div>
        <Button
          className="shadow-sm"
          color="primary"
          startContent={<Plus size={18} />}
          onPress={handleCreate}
        >
          Add Record
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-blue-50 dark:bg-blue-950 rounded-lg">
              <FileText className="text-blue-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Total Records</p>
              <p className="text-xl font-bold">{mockMedicalRecords.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-green-50 dark:bg-green-950 rounded-lg">
              <Stethoscope className="text-green-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Consultations</p>
              <p className="text-xl font-bold">
                {
                  mockMedicalRecords.filter(
                    (r) => r.recordType === "consultation"
                  ).length
                }
              </p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-purple-50 dark:bg-purple-950 rounded-lg">
              <TestTube className="text-purple-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Lab Tests</p>
              <p className="text-xl font-bold">{mockLabTests.length}</p>
            </div>
          </CardBody>
        </Card>
        <Card className="shadow-sm border border-divider">
          <CardBody className="flex flex-row items-center gap-3">
            <div className="p-2 bg-orange-50 dark:bg-orange-950 rounded-lg">
              <Calendar className="text-orange-500" size={20} />
            </div>
            <div>
              <p className="text-sm text-default-500">Prescriptions</p>
              <p className="text-xl font-bold">{mockPrescriptions.length}</p>
            </div>
          </CardBody>
        </Card>
      </div>

      {/* Filters */}
      <FilterBar
        searchPlaceholder="Search by patient, doctor, or diagnosis..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select
          className="max-w-xs"
          placeholder="Filter by type"
          selectedKeys={typeFilter ? [typeFilter] : []}
          startContent={<Filter size={18} />}
          variant="bordered"
          onChange={(e) => setTypeFilter(e.target.value)}
        >
          <SelectItem key="">All Types</SelectItem>
          <SelectItem key="consultation">Consultation</SelectItem>
          <SelectItem key="follow-up">Follow-up</SelectItem>
          <SelectItem key="emergency">Emergency</SelectItem>
          <SelectItem key="lab-test">Lab Test</SelectItem>
        </Select>
      </FilterBar>

      {/* Records Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredRecords.map((record) => (
          <Card
            key={record.id}
            className="shadow-sm border border-divider hover:shadow-md transition-shadow"
          >
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-3">
                  <Avatar
                    size="sm"
                    src={`https://i.pravatar.cc/150?u=${record.patientName}`}
                  />
                  <div>
                    <h3 className="font-semibold">{record.patientName}</h3>
                    <p className="text-sm text-default-500">{record.date}</p>
                  </div>
                </div>
                <Chip
                  color={
                    record.recordType === "consultation"
                      ? "primary"
                      : record.recordType === "emergency"
                        ? "danger"
                        : "secondary"
                  }
                  size="sm"
                  variant="flat"
                >
                  {record.recordType}
                </Chip>
              </div>
            </CardHeader>
            <CardBody className="pt-0">
              <div className="space-y-3">
                <div>
                  <p className="text-sm font-medium text-default-700">
                    Diagnosis
                  </p>
                  <p className="text-sm text-default-600">{record.diagnosis}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-default-700">
                    Treatment
                  </p>
                  <p className="text-sm text-default-600">{record.treatment}</p>
                </div>
                {record.vitals && (
                  <div>
                    <p className="text-sm font-medium text-default-700 mb-1">
                      Vitals
                    </p>
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-default-500">BP:</span>{" "}
                        {record.vitals.bloodPressure}
                      </div>
                      <div>
                        <span className="text-default-500">HR:</span>{" "}
                        {record.vitals.heartRate}
                      </div>
                      <div>
                        <span className="text-default-500">Temp:</span>{" "}
                        {record.vitals.temperature}°F
                      </div>
                    </div>
                  </div>
                )}
                <div>
                  <p className="text-sm font-medium text-default-700">Doctor</p>
                  <p className="text-sm text-default-600">
                    {record.doctorName}
                  </p>
                </div>
                <div className="flex gap-2 pt-3 border-t border-divider">
                  <Button
                    size="sm"
                    variant="bordered"
                    onPress={() => handleEdit(record)}
                  >
                    Edit
                  </Button>
                  <Button
                    color="danger"
                    size="sm"
                    variant="light"
                    onPress={() => handleDelete(record.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      <MedicalRecordModal
        isLoading={isLoading}
        isOpen={isModalOpen}
        mode={selectedRecord ? "edit" : "add"}
        record={selectedRecord}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
      />
    </div>
  );
}
