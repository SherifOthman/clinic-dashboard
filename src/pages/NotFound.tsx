import { Button } from "@heroui/button";
import { Card, CardBody } from "@heroui/card";
import { ArrowLeft, Home, Search } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="max-w-md w-full shadow-lg border border-divider">
        <CardBody className="text-center p-8">
          {/* 404 Illustration */}
          <div className="mb-6">
            <div className="text-8xl font-bold text-primary/20 mb-2">404</div>
            <div className="flex justify-center mb-4">
              <div className="p-4 bg-primary/10 rounded-full">
                <Search size={48} className="text-primary" />
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <h1 className="text-2xl font-bold text-foreground">
              Page Not Found
            </h1>
            <p className="text-default-500">
              Sorry, we couldn't find the page you're looking for. The page
              might have been moved, deleted, or you entered the wrong URL.
            </p>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 mt-8">
            <Button
              color="primary"
              startContent={<Home size={18} />}
              as={Link}
              to="/"
              className="flex-1"
            >
              Go Home
            </Button>
            <Button
              variant="bordered"
              startContent={<ArrowLeft size={18} />}
              onPress={() => navigate(-1)}
              className="flex-1"
            >
              Go Back
            </Button>
          </div>

          {/* Quick Links */}
          <div className="mt-8 pt-6 border-t border-divider">
            <p className="text-sm text-default-500 mb-3">Quick Links:</p>
            <div className="flex flex-wrap gap-2 justify-center">
              <Button size="sm" variant="light" as={Link} to="/clinics">
                Clinics
              </Button>
              <Button size="sm" variant="light" as={Link} to="/patients">
                Patients
              </Button>
              <Button size="sm" variant="light" as={Link} to="/doctors">
                Doctors
              </Button>
              <Button size="sm" variant="light" as={Link} to="/appointments">
                Appointments
              </Button>
            </div>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
