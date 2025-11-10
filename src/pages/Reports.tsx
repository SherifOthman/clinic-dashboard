import { Button } from "@heroui/button";
import { Card, CardBody, CardHeader } from "@heroui/card";
import { Chip } from "@heroui/chip";
import { Select, SelectItem } from "@heroui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
} from "@heroui/table";
import {
  Activity,
  BarChart3,
  Calendar,
  Clock,
  DollarSign,
  Download,
  FileText,
  Filter,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";

const reportTypes = [
  { key: "financial", label: "Financial Reports", icon: DollarSign },
  { key: "patient", label: "Patient Analytics", icon: Users },
  { key: "appointment", label: "Appointment Statistics", icon: Calendar },
  { key: "clinic", label: "Clinic Performance", icon: Activity },
];

const mockReportData = [
  {
    id: "1",
    type: "financial",
    title: "Monthly Revenue Report",
    period: "October 2024",
    totalRevenue: 45600,
    totalAppointments: 342,
    averagePerAppointment: 133.33,
    status: "completed",
    generatedAt: "2024-10-25",
  },
  {
    id: "2",
    type: "patient",
    title: "Patient Demographics Analysis",
    period: "Q3 2024",
    totalPatients: 1234,
    newPatients: 156,
    returningPatients: 1078,
    status: "completed",
    generatedAt: "2024-10-20",
  },
  {
    id: "3",
    type: "appointment",
    title: "Appointment Efficiency Report",
    period: "October 2024",
    totalAppointments: 342,
    completedAppointments: 298,
    cancelledAppointments: 44,
    status: "processing",
    generatedAt: "2024-10-25",
  },
];

const quickStats = [
  {
    title: "Total Revenue (This Month)",
    value: "$45,600",
    change: "+12.5%",
    icon: DollarSign,
    color: "text-green-500",
  },
  {
    title: "Patient Satisfaction",
    value: "4.8/5.0",
    change: "+0.2",
    icon: Users,
    color: "text-blue-500",
  },
  {
    title: "Average Wait Time",
    value: "12 min",
    change: "-3 min",
    icon: Clock,
    color: "text-purple-500",
  },
  {
    title: "Appointment Success Rate",
    value: "87.1%",
    change: "+2.3%",
    icon: TrendingUp,
    color: "text-orange-500",
  },
];

export default function ReportsPage() {
  const [selectedType, setSelectedType] = useState("");
  const [dateRange, setDateRange] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateReport = () => {
    showNotImplemented("Generate report");
  };

  const handleDownloadReport = (reportId: string) => {
    showNotImplemented("Download report");
  };

  const filteredReports = mockReportData.filter((report) => {
    return !selectedType || report.type === selectedType;
  });

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Reports & Analytics</h1>
          <p className="text-sm text-default-500">
            Generate and view comprehensive clinic reports
          </p>
        </div>
        <Button
          color="primary"
          startContent={<FileText size={18} />}
          onPress={handleGenerateReport}
          isLoading={isGenerating}
          className="shadow-sm"
        >
          Generate New Report
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {quickStats.map((stat, index) => (
          <Card key={index} className="shadow-sm">
            <CardBody className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-default-500">{stat.title}</p>
                  <p className="text-2xl font-bold">{stat.value}</p>
                  <p className={`text-sm ${stat.color}`}>
                    {stat.change} from last month
                  </p>
                </div>
                <div className={`p-3 rounded-lg bg-default-100`}>
                  <stat.icon size={24} className={stat.color} />
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Report Types */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {reportTypes.map((type) => (
          <Card
            key={type.key}
            className="shadow-sm hover:shadow-md transition-shadow cursor-pointer"
            isPressable
            onPress={() => setSelectedType(type.key)}
          >
            <CardBody className="p-4 text-center">
              <div className="flex flex-col items-center gap-3">
                <div className="p-3 rounded-lg bg-primary-50 dark:bg-primary-950">
                  <type.icon size={24} className="text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold">{type.label}</h3>
                  <p className="text-sm text-default-500">
                    View detailed analytics
                  </p>
                </div>
              </div>
            </CardBody>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card className="shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Report Filters</h3>
        </CardHeader>
        <CardBody>
          <div className="flex flex-col sm:flex-row gap-4">
            <Select
              placeholder="Filter by report type"
              className="max-w-xs"
              variant="bordered"
              selectedKeys={selectedType ? [selectedType] : []}
              onChange={(e) => setSelectedType(e.target.value)}
              startContent={<Filter size={18} />}
            >
              <SelectItem key="">All Types</SelectItem>
              <SelectItem key="financial">Financial Reports</SelectItem>
              <SelectItem key="patient">Patient Analytics</SelectItem>
              <SelectItem key="appointment">Appointment Statistics</SelectItem>
              <SelectItem key="clinic">Clinic Performance</SelectItem>
            </Select>
            <Select
              placeholder="Select date range"
              className="max-w-xs"
              variant="bordered"
              selectedKeys={dateRange ? [dateRange] : []}
              onChange={(e) => setDateRange(e.target.value)}
              startContent={<Calendar size={18} />}
            >
              <SelectItem key="today">Today</SelectItem>
              <SelectItem key="week">This Week</SelectItem>
              <SelectItem key="month">This Month</SelectItem>
              <SelectItem key="quarter">This Quarter</SelectItem>
              <SelectItem key="year">This Year</SelectItem>
              <SelectItem key="custom">Custom Range</SelectItem>
            </Select>
          </div>
        </CardBody>
      </Card>

      {/* Reports Table */}
      <Card className="shadow-sm">
        <CardHeader>
          <h3 className="text-lg font-semibold">Generated Reports</h3>
        </CardHeader>
        <CardBody className="p-0">
          <Table aria-label="Reports table" removeWrapper>
            <TableHeader>
              <TableColumn>REPORT</TableColumn>
              <TableColumn>TYPE</TableColumn>
              <TableColumn>PERIOD</TableColumn>
              <TableColumn>KEY METRICS</TableColumn>
              <TableColumn>STATUS</TableColumn>
              <TableColumn>ACTIONS</TableColumn>
            </TableHeader>
            <TableBody>
              {filteredReports.map((report) => (
                <TableRow key={report.id}>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{report.title}</span>
                      <span className="text-xs text-default-500">
                        Generated on {report.generatedAt}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip size="sm" variant="flat" color="primary">
                      {report.type}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{report.period}</span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col text-sm">
                      {report.type === "financial" && (
                        <>
                          <span>
                            Revenue: {formatCurrency(report.totalRevenue || 0)}
                          </span>
                          <span className="text-default-500">
                            {report.totalAppointments} appointments
                          </span>
                        </>
                      )}
                      {report.type === "patient" && (
                        <>
                          <span>Total: {report.totalPatients}</span>
                          <span className="text-default-500">
                            {report.newPatients} new patients
                          </span>
                        </>
                      )}
                      {report.type === "appointment" && (
                        <>
                          <span>Total: {report.totalAppointments}</span>
                          <span className="text-default-500">
                            {report.completedAppointments} completed
                          </span>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="sm"
                      variant="flat"
                      color={
                        report.status === "completed" ? "success" : "warning"
                      }
                    >
                      {report.status}
                    </Chip>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="light"
                        startContent={<Download size={16} />}
                        onPress={() => handleDownloadReport(report.id)}
                      >
                        Download
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardBody>
      </Card>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 size={20} />
              <h3 className="text-lg font-semibold">Revenue Trends</h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-default-50 rounded-lg">
              <div className="text-center">
                <BarChart3
                  size={48}
                  className="text-default-300 mx-auto mb-2"
                />
                <p className="text-default-500">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-default-400">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardBody>
        </Card>

        <Card className="shadow-sm">
          <CardHeader>
            <div className="flex items-center gap-2">
              <PieChart size={20} />
              <h3 className="text-lg font-semibold">
                Appointment Distribution
              </h3>
            </div>
          </CardHeader>
          <CardBody>
            <div className="h-64 flex items-center justify-center bg-default-50 rounded-lg">
              <div className="text-center">
                <PieChart size={48} className="text-default-300 mx-auto mb-2" />
                <p className="text-default-500">
                  Chart visualization would go here
                </p>
                <p className="text-sm text-default-400">
                  Integration with charting library needed
                </p>
              </div>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
}
