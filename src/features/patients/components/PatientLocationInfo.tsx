import { LocationSelector } from "@/core/components/LocationSelector";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import type { PatientDto } from "../types/patient";

interface PatientLocationInfoProps {
  locationState: any;
  patient?: PatientDto;
  isEditing: boolean;
}

export function PatientLocationInfo({
  locationState,
  patient,
  isEditing,
}: PatientLocationInfoProps) {
  return (
    <div className="space-y-4">
      {isEditing && patient?.cityGeoNameId && (
        <Card className="bg-default-50">
          <CardBody className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-default-600 mb-1">
                  Current Location
                </p>
                <Chip color="primary" variant="flat">
                  City ID: {patient.cityGeoNameId}
                </Chip>
                <p className="text-xs text-default-500 mt-1">
                  To change location, select new country, state, and city below
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      )}

      <div>
        <p className="text-sm font-medium text-default-700 mb-2">
          {isEditing && patient?.cityGeoNameId
            ? "New Location (Optional)"
            : "Location"}
        </p>
        <LocationSelector
          onLocationChange={locationState.handleLocationChange}
          variant="bordered"
          size="md"
        />
      </div>
    </div>
  );
}
