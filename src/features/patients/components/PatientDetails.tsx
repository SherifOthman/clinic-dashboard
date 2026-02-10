import { useDateFormat } from "@/core/hooks/useDateFormat";
import { useGenderDisplay } from "@/core/hooks/useGenderDisplay";
import { getGenderColor } from "@/core/utils/genderUtils";
import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Calendar, Edit, MapPin, Phone, Stethoscope, User } from "lucide-react";
import type { PatientDto } from "../types/patient";

interface PatientDetailsProps {
  patient: PatientDto;
  onEdit?: () => void;
}

export function PatientDetails({ patient, onEdit }: PatientDetailsProps) {
  const { formatDateLong, formatDateTime } = useDateFormat();
  const { getTranslatedGenderDisplay } = useGenderDisplay();
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
            <User className="w-8 h-8 text-primary" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              {patient.fullName}
            </h1>
            <p className="text-default-600">Patient ID: {patient.id}</p>
          </div>
        </div>
        <Button
          color="primary"
          variant="flat"
          startContent={<Edit className="w-4 h-4" />}
          onPress={onEdit}
        >
          Edit Patient
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <User className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Basic Information</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-default-600">Full Name</p>
                <p className="font-medium">{patient.fullName}</p>
              </div>
              <div>
                <p className="text-sm text-default-600">Age</p>
                <p className="font-medium">{patient.age} years</p>
              </div>
              {patient.dateOfBirth && (
                <div>
                  <p className="text-sm text-default-600">Date of Birth</p>
                  <p className="font-medium">
                    {formatDateLong(patient.dateOfBirth)}
                  </p>
                </div>
              )}
              {patient.gender !== undefined && patient.gender !== null && (
                <div>
                  <p className="text-sm text-default-600">Gender</p>
                  <Chip
                    size="sm"
                    variant="flat"
                    color={getGenderColor(patient.gender)}
                  >
                    {getTranslatedGenderDisplay(patient.gender)}
                  </Chip>
                </div>
              )}
              {patient.cityGeoNameId && (
                <div className="col-span-2">
                  <p className="text-sm text-default-600">Location</p>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-default-400" />
                    <p className="font-medium">
                      City ID: {patient.cityGeoNameId}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* Contact Information */}
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Phone className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
          </CardHeader>
          <CardBody className="space-y-3">
            {patient.phoneNumbers.length === 0 ? (
              <p className="text-default-500">No phone numbers available</p>
            ) : (
              patient.phoneNumbers.map((phone, index) => (
                <div
                  key={phone.id}
                  className="flex items-center justify-between"
                >
                  <div className="flex items-center space-x-3">
                    <Phone className="w-4 h-4 text-default-400" />
                    <div>
                      <p className="font-medium">{phone.phoneNumber}</p>
                    </div>
                  </div>
                  {index === 0 && (
                    <Chip size="sm" variant="flat" color="primary">
                      Primary
                    </Chip>
                  )}
                </div>
              ))
            )}
          </CardBody>
        </Card>

        {/* Medical Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center space-x-2">
              <Stethoscope className="w-5 h-5 text-primary" />
              <h3 className="text-lg font-semibold">Medical Information</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div>
              <h4 className="font-medium mb-3">Chronic Diseases</h4>
              {patient.chronicDiseases.length === 0 ? (
                <p className="text-default-500">No chronic diseases recorded</p>
              ) : (
                <div className="space-y-3">
                  {patient.chronicDiseases.map((disease) => (
                    <div
                      key={disease.id}
                      className="border border-default-200 rounded-lg p-4"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          <h5 className="font-medium">
                            {disease.chronicDisease.name}
                          </h5>
                        </div>
                        <div className="flex items-center space-x-1 text-sm text-default-600">
                          <Calendar className="w-4 h-4" />
                          <span>
                            Diagnosed: {formatDateLong(disease.diagnosedDate)}
                          </span>
                        </div>
                      </div>
                      {disease.notes && (
                        <p className="text-sm text-default-600">
                          {disease.notes}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </CardBody>
        </Card>

        {/* System Information */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <h3 className="text-lg font-semibold">System Information</h3>
          </CardHeader>
          <CardBody>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-default-600">Created At</p>
                <p className="font-medium">
                  {formatDateTime(patient.createdAt)}
                </p>
              </div>
              {patient.updatedAt && (
                <div>
                  <p className="text-default-600">Last Updated</p>
                  <p className="font-medium">
                    {formatDateTime(patient.updatedAt)}
                  </p>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
