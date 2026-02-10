import { PageContainer } from "@/core/components/ui/PageContainer";
import { PageHeader } from "@/core/components/ui/PageHeader";
import { genderToNumber } from "@/core/utils/genderUtils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { PatientModal } from "../components/PatientModal";
import { PatientsList } from "../components/PatientsList";
import {
  useCreatePatient,
  useUpdatePatient,
} from "../hooks/usePatientsMutations";
import { usePatient } from "../hooks/usePatientsQueries";
import type {
  CreatePatientFormData,
  UpdatePatientFormData,
} from "../schemas/patientSchemas";
import type { PatientDto } from "../types/patient";

type ViewMode = "list" | "create" | "edit" | "details";

export function PatientsPage() {
  const { t } = useTranslation();
  const [viewMode, setViewMode] = useState<ViewMode>("list");
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(
    null,
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  const createPatient = useCreatePatient();
  const updatePatient = useUpdatePatient();
  const { data: selectedPatient } = usePatient(selectedPatientId || "");

  const handleCreatePatient = () => {
    setViewMode("create");
    setSelectedPatientId(null);
    setIsModalOpen(true);
  };

  const handleEditPatient = (patient: PatientDto) => {
    setViewMode("edit");
    setSelectedPatientId(patient.id);
    setIsModalOpen(true);
  };

  const handleViewPatient = (patient: PatientDto) => {
    setViewMode("details");
    setSelectedPatientId(patient.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setViewMode("list");
    setSelectedPatientId(null);
  };

  const handleCreateSubmit = async (data: CreatePatientFormData) => {
    try {
      await createPatient.mutateAsync({
        fullName: data.fullName,
        dateOfBirth: data.dateOfBirth!,
        gender: genderToNumber(data.gender)!,
        cityGeoNameId: data.cityGeoNameId,
        phoneNumbers: data.phoneNumbers.map((p) => ({
          phoneNumber: p.phoneNumber,
          isPrimary: p.isPrimary || false,
        })),
        chronicDiseaseIds: data.chronicDiseaseIds || [],
      });
      handleCloseModal();
    } catch (error) {
      console.error("Patient creation error:", error);
    }
  };

  const handleUpdateSubmit = async (data: UpdatePatientFormData) => {
    if (!selectedPatientId) return;

    try {
      await updatePatient.mutateAsync({
        id: selectedPatientId,
        patient: {
          fullName: data.fullName,
          dateOfBirth: data.dateOfBirth!,
          gender: genderToNumber(data.gender)!,
          cityGeoNameId: data.cityGeoNameId,
          phoneNumbers: data.phoneNumbers.map((p) => ({
            id: p.id,
            phoneNumber: p.phoneNumber,
            isPrimary: p.isPrimary || false,
          })),
          chronicDiseaseIds: data.chronicDiseaseIds || [],
        },
      });
      handleCloseModal();
    } catch (error) {
      console.error("Patient update error:", error);
    }
  };

  const handleEditFromDetails = () => {
    setViewMode("edit");
  };

  return (
    <PageContainer>
      <PageHeader
        title={t("patients.title")}
        subtitle={t("patients.subtitle")}
      />

      <PatientsList
        onPatientCreate={handleCreatePatient}
        onPatientEdit={handleEditPatient}
        onPatientView={handleViewPatient}
      />

      <PatientModal
        isOpen={isModalOpen}
        viewMode={viewMode as "create" | "edit" | "details"}
        patient={selectedPatient}
        onClose={handleCloseModal}
        onCreateSubmit={handleCreateSubmit}
        onUpdateSubmit={handleUpdateSubmit}
        onEdit={handleEditFromDetails}
        createLoading={createPatient.isPending}
        updateLoading={updatePatient.isPending}
        createError={createPatient.error}
        updateError={updatePatient.error}
      />
    </PageContainer>
  );
}
