import { Avatar } from "@heroui/avatar";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Calendar, Clock, User } from "lucide-react";

interface Appointment {
  id: string;
  patientName: string;
  doctorName: string;
  time: string;
  status: "scheduled" | "confirmed" | "in-progress" | "completed" | "cancelled";
  type: string;
}

interface RecentAppointmentsProps {
  appointments: Appointment[];
}

const statusColorMap: Record<string, any> = {
  scheduled: "default",
  confirmed: "primary",
  "in-progress": "warning",
  completed: "success",
  cancelled: "danger",
};

export function RecentAppointments({ appointments }: RecentAppointmentsProps) {
  return (
    <Card className="shadow-sm border border-divider bg-content1">
      <CardHeader className="bg-content2/50">
        <div className="flex items-center gap-2">
          <Calendar size={20} />
          <h3 className="text-lg font-semibold">Recent Appointments</h3>
        </div>
      </CardHeader>
      <CardBody className="space-y-3">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-3 rounded-lg bg-content2/30 border border-divider/30"
          >
            <div className="flex items-center gap-3">
              <Avatar
                src={`https://i.pravatar.cc/150?u=${appointment.patientName}`}
                size="sm"
              />
              <div>
                <div className="flex items-center gap-1">
                  <User size={12} className="text-default-400" />
                  <p className="font-medium text-sm">
                    {appointment.patientName}
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Clock size={12} className="text-default-400" />
                  <p className="text-xs text-default-500">
                    {appointment.time} - {appointment.doctorName}
                  </p>
                </div>
              </div>
            </div>
            <Chip
              size="sm"
              variant="flat"
              color={statusColorMap[appointment.status]}
            >
              {appointment.status}
            </Chip>
          </div>
        ))}
      </CardBody>
    </Card>
  );
}
