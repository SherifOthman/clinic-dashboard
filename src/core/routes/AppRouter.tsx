import { DashboardLayout } from "@/core/layouts/DashboardLayout";
import { AuthLayout } from "@/core/layouts/AuthLayout";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes, useParams } from "react-router-dom";
import { ErrorBoundary } from "../components/ui/ErrorBoundary";
import { Loading } from "../components/ui/Loading";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

/**
 * Redirects old dashboard invitation links to the website.
 * The API now sends invitation emails pointing to the website directly,
 * but this handles any old links that still point to the dashboard.
 */
function AcceptInvitationRedirect() {
  const { token } = useParams<{ token: string }>();
  const websiteUrl = import.meta.env.VITE_AUTH_URL?.replace("/en/login", "") ?? "http://localhost:3001";
  window.location.replace(`${websiteUrl}/en/accept-invitation/${token}`);
  return null;
}

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
const SettingsPage     = lazy(() => import("@/features/settings/SettingsPage"));
const UsagePage        = lazy(() => import("@/features/usage/UsagePage"));
const AdminSpecializationsPage = lazy(() => import("@/features/admin/SpecializationsPage"));
const AdminChronicDiseasesPage = lazy(() => import("@/features/admin/ChronicDiseasesPage"));

export function AppRouter() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<Loading className="h-screen" />}>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          {/* Old invitation links — redirect to website */}
          <Route path="/accept-invitation/:token" element={<AcceptInvitationRedirect />} />

          {/* Protected routes */}
          <Route element={<RequireAuth />}>
            {/* Onboarding — uses AuthLayout (centered, no sidebar) */}
            <Route element={<AuthLayout />}>
              <Route path="/onboarding" element={<OnboardingWizard />} />
            </Route>

            <Route element={<RequireRole />}>
              <Route element={<DashboardLayout />}>
                <Route path="/appointments" element={<ErrorBoundary><AppointmentsPage /></ErrorBoundary>} />
                <Route path="/dashboard"    element={<ErrorBoundary><DashboardPage /></ErrorBoundary>} />
                <Route path="/patients"     element={<ErrorBoundary><PatientsPage /></ErrorBoundary>} />
                <Route path="/staff"        element={<ErrorBoundary><StaffPage /></ErrorBoundary>} />
                <Route path="/invitations"  element={<ErrorBoundary><InvitationsPage /></ErrorBoundary>} />
                <Route path="/audit"        element={<ErrorBoundary><AuditPage /></ErrorBoundary>} />
                <Route path="/branches"     element={<ErrorBoundary><BranchesPage /></ErrorBoundary>} />
                <Route path="/profile"      element={<ErrorBoundary><ProfilePage /></ErrorBoundary>} />
                <Route path="/messages"     element={<ErrorBoundary><MessagesPage /></ErrorBoundary>} />
                <Route path="/reviews"      element={<ErrorBoundary><ReviewsPage /></ErrorBoundary>} />
                <Route path="/settings"     element={<ErrorBoundary><SettingsPage /></ErrorBoundary>} />
                <Route path="/usage"        element={<ErrorBoundary><UsagePage /></ErrorBoundary>} />
                <Route path="/admin/specializations"  element={<ErrorBoundary><AdminSpecializationsPage /></ErrorBoundary>} />
                <Route path="/admin/chronic-diseases" element={<ErrorBoundary><AdminChronicDiseasesPage /></ErrorBoundary>} />
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
