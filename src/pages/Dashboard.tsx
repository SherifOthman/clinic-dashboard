import {
  RecentAppointments,
  StatsCard,
  TodayOverview,
} from "@/features/dashboard";
import {
  AlertTriangle,
  DollarSign,
  Package,
  TrendingUp,
  UserCheck,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Total Patients",
    value: "1,234",
    icon: Users,
    color: "text-blue-500",
    bgColor: "bg-blue-50 dark:bg-blue-950",
    change: "+8%",
    changeType: "increase" as const,
  },
  {
    title: "Active Staff",
    value: "47",
    icon: UserCheck,
    color: "text-green-500",
    bgColor: "bg-green-50 dark:bg-green-950",
    change: "+2",
    changeType: "increase" as const,
  },
  {
    title: "Monthly Revenue",
    value: "$45,600",
    icon: DollarSign,
    color: "text-purple-500",
    bgColor: "bg-purple-50 dark:bg-purple-950",
    change: "+12.5%",
    changeType: "increase" as const,
  },
  {
    title: "Low Stock Items",
    value: "7",
    icon: AlertTriangle,
    color: "text-orange-500",
    bgColor: "bg-orange-50 dark:bg-orange-950",
    change: "+3",
    changeType: "increase" as const,
  },
];

const todayStats = {
  pending: 23,
  completed: 45,
  cancelled: 3,
  total: 71,
};

const recentAppointments = [
  {
    id: "1",
    patientName: "Sarah Johnson",
    doctorName: "Dr. Smith",
    time: "09:00 AM",
    status: "confirmed" as const,
    type: "consultation",
  },
  {
    id: "2",
    patientName: "Michael Brown",
    doctorName: "Dr. Wilson",
    time: "10:30 AM",
    status: "in-progress" as const,
    type: "follow-up",
  },
  {
    id: "3",
    patientName: "Emma Davis",
    doctorName: "Dr. Johnson",
    time: "11:00 AM",
    status: "scheduled" as const,
    type: "checkup",
  },
  {
    id: "4",
    patientName: "James Wilson",
    doctorName: "Dr. Smith",
    time: "02:30 PM",
    status: "confirmed" as const,
    type: "emergency",
  },
];

export default function Dashboard() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-default-500">
          Welcome back! Here's what's happening at your clinics today.
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <StatsCard key={index} {...stat} />
        ))}
      </div>

      {/* Today's Overview and Recent Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <TodayOverview stats={todayStats} />
        <div className="lg:col-span-2">
          <RecentAppointments appointments={recentAppointments} />
        </div>
      </div>

      {/* Additional Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-content1 rounded-lg p-4 border border-divider shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Pending Lab Results</p>
              <p className="text-2xl font-bold">12</p>
              <p className="text-sm text-warning">Needs attention</p>
            </div>
            <div className="p-3 rounded-lg bg-warning-50 dark:bg-warning-950">
              <Package size={24} className="text-warning" />
            </div>
          </div>
        </div>

        <div className="bg-content1 rounded-lg p-4 border border-divider shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Outstanding Bills</p>
              <p className="text-2xl font-bold">$8,450</p>
              <p className="text-sm text-danger">Follow up required</p>
            </div>
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-950">
              <DollarSign size={24} className="text-danger" />
            </div>
          </div>
        </div>

        <div className="bg-content1 rounded-lg p-4 border border-divider shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Active Prescriptions</p>
              <p className="text-2xl font-bold">156</p>
              <p className="text-sm text-success">All current</p>
            </div>
            <div className="p-3 rounded-lg bg-success-50 dark:bg-success-950">
              <TrendingUp size={24} className="text-success" />
            </div>
          </div>
        </div>

        <div className="bg-content1 rounded-lg p-4 border border-divider shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-default-500">Critical Inventory</p>
              <p className="text-2xl font-bold">3</p>
              <p className="text-sm text-danger">Reorder now</p>
            </div>
            <div className="p-3 rounded-lg bg-danger-50 dark:bg-danger-950">
              <AlertTriangle size={24} className="text-danger" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
