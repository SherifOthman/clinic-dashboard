import { DashboardLayout } from "@/core/layouts/DashboardLayout";
import { AuthLayout } from "@/core/layouts/AuthLayout";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { Loading } from "../components/ui/Loading";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

// Dashboard pages — lazy loaded
const DashboardPage    = lazy(() => import("@/features/dashboard/DashboardPage"));
const OnboardingWizard = lazy(() => import("@/features/onboarding/OnboardingWizard"));
const PatientsPage     = lazy(() => import("@/features/patients/PatientsPage"));
const ProfilePage      = lazy(() => import("@/features/profile/ProfilePage"));
const StaffPage        = lazy(() => import("@/features/staff/StaffPage"));

const AuditPage        = lazy(() => import("@/features/audit/AuditPage"));
const BranchesPage     = lazy(() => import("@/features/branches/BranchesPage"));
const MessagesPage     = lazy(() => import("@/features/dashboard/MessagesPage"));
const ReviewsPage      = lazy(() => import("@/features/dashboard/ReviewsPage"));

const UsagePage        = lazy(() => import("@/features/usage/UsagePage"));
const AdminSpecializationsPage = lazy(() => import("@/features/admin/SpecializationsPage"));
const AdminChronicDiseasesPage = lazy(() => import("@/features/admin/ChronicDiseasesPage"));

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading className="h-screen" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            {/* Onboarding — uses AuthLayout (centered, no sidebar) */}
            <Route element={<AuthLayout />}>
              <Route path="/onboarding" element={<OnboardingWizard />} />
            </Route>

            <Route element={<RequireRole />}>
              <Route element={<DashboardLayout />}>

                <Route path="/dashboard"    element={<DashboardPage />} />
                <Route path="/patients"     element={<PatientsPage />} />
                <Route path="/staff"        element={<StaffPage />} />
                <Route path="/audit"        element={<AuditPage />} />
                <Route path="/branches"     element={<BranchesPage />} />
                <Route path="/profile"      element={<ProfilePage />} />
                <Route path="/messages"     element={<MessagesPage />} />
                <Route path="/reviews"      element={<ReviewsPage />} />
                <Route path="/usage"        element={<UsagePage />} />
                <Route path="/admin/specializations"  element={<AdminSpecializationsPage />} />
                <Route path="/admin/chronic-diseases" element={<AdminChronicDiseasesPage />} />
              </Route>
            </Route>
          </Route>

          <Route path="/unauthorized" element={<UnauthorizedPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
