import { AuthLayout } from "@/core/layouts/AuthLayout";
import { DashboardLayout } from "@/core/layouts/DashboardLayout";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import { lazy, Suspense } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import { Loading } from "../components/ui/Loading";
import { RequireAuth } from "./RequireAuth";
import { RequireGuest } from "./RequireGuest";
import { RequireRole } from "./RequireRole";

// Lazy load pages for code splitting
const LoginPage = lazy(() => import("@/features/auth/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/features/auth/pages/RegisterPage"));
const ForgotPasswordPage = lazy(
  () => import("@/features/auth/pages/ForgotPasswordPage"),
);
const ResetPasswordPage = lazy(
  () => import("@/features/auth/pages/ResetPasswordPage"),
);
const PasswordChangedPage = lazy(
  () => import("@/features/auth/pages/PasswordChangedPage"),
);
const ResendEmailVerificationPage = lazy(
  () => import("@/features/auth/pages/ResendEmailVerificationPage"),
);
const ConfirmEmailPage = lazy(
  () => import("@/features/auth/pages/ConfirmEmailPage"),
);
const VerifyEmailPage = lazy(
  () => import("@/features/auth/pages/VerifyEmailPage"),
);
const DashboardPage = lazy(() => import("@/features/dashboard/DashboardPage"));
const OnboardingWizard = lazy(
  () => import("@/features/onboarding/OnboardingWizard"),
);
const PatientsPage = lazy(() => import("@/features/patients/PatientsPage"));
const ProfilePage = lazy(() => import("@/features/profile/ProfilePage"));
const StaffPage = lazy(() => import("@/features/staff/StaffPage"));
const InvitationsPage = lazy(() => import("@/features/staff/InvitationsPage"));
const AuditPage = lazy(() => import("@/features/audit/AuditPage"));
const BranchesPage = lazy(() => import("@/features/branches/BranchesPage"));
const RoleDefaultsPage = lazy(() => import("@/features/permissions/RoleDefaultsPage"));
const AcceptInvitationPage = lazy(
  () => import("@/features/staff/AcceptInvitationPage"),
);

/**
 * Application router with proper nested route structure
 *
 * Flow:
 * - Guest routes: RequireGuest → AuthLayout → Page
 * - Protected routes: RequireAuth → DashboardLayout → Page
 * - Onboarding: RequireAuth → OnboardingPage (no layout)
 */
export function AppRouter() {
  return (
    <Suspense fallback={<Loading className="h-screen" />}>
      <Routes>
        {/* Root redirect */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Guest routes (auth pages) - RequireGuest uses Outlet */}
        <Route element={<RequireGuest />}>
          <Route element={<AuthLayout />}>
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/password-changed" element={<PasswordChangedPage />} />
            <Route
              path="/resend-email-verification"
              element={<ResendEmailVerificationPage />}
            />
          </Route>
        </Route>

        {/* Email verification and confirmation - accessible to both authenticated and guest users */}
        <Route element={<AuthLayout />}>
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/verify-email/:email" element={<VerifyEmailPage />} />
          <Route
            path="/accept-invitation/:token"
            element={<AcceptInvitationPage />}
          />
        </Route>

        {/* Protected routes - RequireAuth uses Outlet */}
        <Route element={<RequireAuth />}>
          {/* Onboarding routes with AuthLayout */}
          <Route element={<AuthLayout />}>
            <Route path="/onboarding" element={<OnboardingWizard />} />
          </Route>

          {/* Routes with DashboardLayout and role-based access */}
          <Route element={<RequireRole />}>
            <Route element={<DashboardLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/patients" element={<PatientsPage />} />
              <Route path="/staff" element={<StaffPage />} />
              <Route path="/invitations" element={<InvitationsPage />} />
              <Route path="/audit" element={<AuditPage />} />
              <Route path="/branches" element={<BranchesPage />} />
              <Route path="/role-defaults" element={<RoleDefaultsPage />} />
              <Route path="/profile" element={<ProfilePage />} />
            </Route>
          </Route>
        </Route>

        {/* System routes */}
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
}

