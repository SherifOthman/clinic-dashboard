import { Card, CardBody } from "@heroui/card";
import { AlertCircle } from "lucide-react";

interface NotImplementedProps {
  feature?: string;
  message?: string;
}

export function NotImplemented({
  feature = "This feature",
  message,
}: NotImplementedProps) {
  return (
    <Card className="shadow-sm border border-warning">
      <CardBody className="flex flex-row items-center gap-3 p-4">
        <AlertCircle className="text-warning" size={24} />
        <div>
          <p className="font-semibold text-warning">Not Implemented</p>
          <p className="text-sm text-default-600">
            {message || `${feature} is not yet implemented.`}
          </p>
        </div>
      </CardBody>
    </Card>
  );
}

export function showNotImplemented(feature?: string) {
  alert(feature ? `${feature} - Not implemented` : "Not implemented");
}
