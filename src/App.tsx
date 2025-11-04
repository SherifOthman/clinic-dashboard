import { Route, Routes } from "react-router-dom";

import { ErrorBoundary } from "@/components/ErrorBoundary";
import DashboardLayout from "@/layouts/DashboardLayout";
import Appointments from "@/pages/Appointments";
import Clinics from "@/pages/Clinics";
import Dashboard from "@/pages/Dashboard";
import Doctors from "@/pages/Doctors";
import Login from "@/pages/Login";
import NotFound from "@/pages/NotFound";
import Patients from "@/pages/Patients";
import ReportsPage from "@/pages/Reports";
import SettingsPage from "@/pages/Settings";
import { CheckTokenFirstOpen } from "./features/auth/CheckTokenFirstOpen";
import { ProtectedRoute } from "./features/auth/ProtectedRoute";
import Billing from "./pages/Billing";
import Inventory from "./pages/Inventory";
import MedicalRecords from "./pages/MedicalRecords";
import Profile from "./pages/Profile";
import Staff from "./pages/Staff";

function App() {
  return (
    <ErrorBoundary>
      <CheckTokenFirstOpen>
        <Routes>
          {/* Public Routes */}
          <Route element={<Login />} path="/login" />

          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
            path="/"
          >
            <Route index element={<Dashboard />} />
            <Route element={<Clinics />} path="clinics" />
            <Route element={<Patients />} path="patients" />
            <Route element={<Doctors />} path="doctors" />
            <Route element={<Staff />} path="staff" />
            <Route element={<Appointments />} path="appointments" />
            <Route element={<MedicalRecords />} path="medical-records" />
            <Route element={<Inventory />} path="inventory" />
            <Route element={<Billing />} path="billing" />
            <Route element={<ReportsPage />} path="reports" />
            <Route element={<SettingsPage />} path="settings" />
            <Route element={<Profile />} path="profile" />
          </Route>

          {/* Not Found */}
          <Route element={<NotFound />} path="*" />
        </Routes>
      </CheckTokenFirstOpen>
    </ErrorBoundary>
  );
}

export default App;
