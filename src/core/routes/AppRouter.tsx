import { DashboardLayout } from "@/core/layouts/DashboardLayout";
import { AuthLayout } from "@/core/layouts/AuthLayout";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/ui/Loading";
import { RequireAuth } from "./RequireAuth";
import { RequireRole } from "./RequireRole";

// Dashboard pages
const DashboardPage  = lazy(() => import("@/features/dashboard/DashboardPage"));
const OnboardingWizard = lazy(() => import("@/features/onboarding/OnboardingWizard"));
const PatientsPage   = lazy(() => import("@/features/patients/PatientsPage"));
const ProfilePage    = lazy(() => import("@/features/profile/ProfilePage"));
const StaffPage      = lazy(() => import("@/features/staff/StaffPage"));
const InvitationsPage = lazy(() => import("@/features/staff/InvitationsPage"));
const AuditPage      = lazy(() => import("@/features/audit/AuditPage"));
const BranchesPage   = lazy(() => import("@/features/branches/BranchesPage"));

// Email verification — still handled here (deep link from email)
const ConfirmEmailPage = lazy(() => import("@/features/auth/pages/ConfirmEmailPage"));
const VerifyEmailPage  = lazy(() => import("@/features/auth/pages/VerifyEmailPage"));

export function AppRouter() {
  return (
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
              <Route path="/dashboard"   element={<DashboardPage />} />
              <Route path="/patients"    element={<PatientsPage />} />
              <Route path="/staff"       element={<StaffPage />} />
              <Route path="/invitations" element={<InvitationsPage />} />
              <Route path="/audit"       element={<AuditPage />} />
              <Route path="/branches"    element={<BranchesPage />} />
              <Route path="/profile"     element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}
