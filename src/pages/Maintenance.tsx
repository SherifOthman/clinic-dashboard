import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Clock, Mail, RefreshCw, Settings } from "lucide-react";

export default function Maintenance() {
  const handleRefresh = () => {
    window.location.reload();
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border border-divider">
        <CardBody className="text-center p-8">
          {/* Maintenance Illustration */}
          <div className="mb-6">
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-warning/10 rounded-full">
                <Settings size={48} className="text-warning animate-spin" />
              </div>
            </div>
            <Chip
              color="warning"
              variant="flat"
              size="lg"
              startContent={<Clock size={16} />}
              className="mb-2"
            >
              Under Maintenance
            </Chip>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              We'll be back soon!
            </h1>
            <p className="text-default-500">
              ClinicMS is currently undergoing scheduled maintenance to improve
              your experience. We apologize for any inconvenience.
            </p>
          </div>

          {/* Estimated Time */}
          <div className="mt-6 p-4 bg-default-50 rounded-lg">
            <p className="text-sm font-medium text-default-700 mb-1">
              Estimated completion time:
            </p>
            <p className="text-lg font-bold text-primary">30 minutes</p>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-8">
            <Button
              color="primary"
              startContent={<RefreshCw size={18} />}
              onPress={handleRefresh}
              className="w-full"
            >
              Check Again
            </Button>
            <Button
              variant="bordered"
              startContent={<Mail size={18} />}
              className="w-full"
            >
              Contact Support
            </Button>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-divider">
            <p className="text-xs text-default-400">
              Follow us on social media for real-time updates
            </p>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
