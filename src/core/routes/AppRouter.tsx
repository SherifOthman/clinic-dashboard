import { DashboardLayout } from "@/core/layouts/DashboardLayout";
import { AuthLayout } from "@/core/layouts/AuthLayout";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { Loading } from "../components/ui/Loading";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

// Dashboard pages
const DashboardPage    = lazy(() => import("@/features/dashboard/DashboardPage"));
const OnboardingWizard = lazy(() => import("@/features/onboarding/OnboardingWizard"));
const PatientsPage     = lazy(() => import("@/features/patients/PatientsPage"));
const ProfilePage      = lazy(() => import("@/features/profile/ProfilePage"));
const StaffPage        = lazy(() => import("@/features/staff/StaffPage"));
const InvitationsPage  = lazy(() => import("@/features/staff/InvitationsPage"));
const AuditPage        = lazy(() => import("@/features/audit/AuditPage"));
const BranchesPage     = lazy(() => import("@/features/branches/BranchesPage"));
const MessagesPage     = lazy(() => import("@/features/dashboard/MessagesPage"));
const ReviewsPage      = lazy(() => import("@/features/dashboard/ReviewsPage"));
const AppointmentsPage = lazy(() => import("@/features/appointments/AppointmentsPage"));

// Email verification — still handled here (deep link from email)
const ConfirmEmailPage = lazy(() => import("@/features/auth/pages/ConfirmEmailPage"));
const VerifyEmailPage  = lazy(() => import("@/features/auth/pages/VerifyEmailPage"));

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading className="h-screen" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Email verification — accessible without auth */}
          <Route element={<AuthLayout />}>
            <Route path="/confirm-email" element={<ConfirmEmailPage />} />
            <Route path="/verify-email/:email" element={<VerifyEmailPage />} />
          </Route>

          {/* All protected routes */}
          <Route element={<RequireAuth />}>
            <Route element={<AuthLayout />}>
              <Route path="/onboarding" element={<OnboardingWizard />} />
            </Route>

            <Route element={<RequireRole />}>
              <Route element={<DashboardLayout />}>
                <Route path="/appointments" element={<ErrorBoundary><AppointmentsPage /></ErrorBoundary>} />
                <Route path="/dashboard"   element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
                <Route path="/patients"    element={<ErrorBoundary><PatientsPage /></ErrorBoundary>} />
                <Route path="/staff"       element={<ErrorBoundary><StaffPage /></ErrorBoundary>} />
                <Route path="/invitations" element={<ErrorBoundary><InvitationsPage /></ErrorBoundary>} />
                <Route path="/audit"       element={<ErrorBoundary><AuditPage /></ErrorBoundary>} />
                <Route path="/branches"    element={<ErrorBoundary><BranchesPage /></ErrorBoundary>} />
                <Route path="/profile"     element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
                <Route path="/messages"    element={<ErrorBoundary><MessagesPage /></ErrorBoundary>} />
                <Route path="/reviews"     element={<ErrorBoundary><ReviewsPage /></ErrorBoundary>} />
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
