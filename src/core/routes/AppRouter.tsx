import { AuthLayout } from "@/core/layouts/auth";
import { DefaultLayout } from "@/core/layouts/default";
import { NotFoundPage, UnauthorizedPage } from "@/core/pages";
import {
  ConfirmEmailPage,
  ForgotPasswordPage,
  LoginPage,
  PasswordChangedPage,
  RegisterPage,
  ResendEmailVerificationPage,
  ResetPasswordPage,
  VerifyEmailPage,
} from "@/features/auth/pages";
import { DashboardPage } from "@/features/dashboard";
import { OnboardingSuccessPage, OnboardingWizard } from "@/features/onboarding";
import { PatientsPage } from "@/features/patients";
import { ProfilePage } from "@/features/profile";
import { Navigate, Route, Routes } from "react-router-dom";
import { RequireAuth } from "./guards/RequireAuth";
import { RequireGuest } from "./guards/RequireGuest";

/**
 * Application router with proper nested route structure
 *
 * Flow:
 * - Guest routes: RequireGuest → AuthLayout → Page
 * - Protected routes: RequireAuth → DefaultLayout → Page
 * - Onboarding: RequireAuth → OnboardingPage (no layout)
 */
export function AppRouter() {
  return (
    <Routes>
      {/* Root redirect */}
      <Route path="/" element={<Navigate to="/dashboard" replace />} />

      {/* Guest routes (auth pages) - RequireGuest uses Outlet */}
      <Route element={<RequireGuest />}>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/verify-email/:email" element={<VerifyEmailPage />} />
          <Route path="/confirm-email" element={<ConfirmEmailPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/password-changed" element={<PasswordChangedPage />} />
          <Route
            path="/resend-email-verification"
            element={<ResendEmailVerificationPage />}
          />
        </Route>
      </Route>

      {/* Protected routes - RequireAuth uses Outlet */}
      <Route element={<RequireAuth />}>
        {/* Onboarding routes (no layout) */}
        <Route path="/onboarding" element={<OnboardingWizard />} />
        <Route path="/onboarding-success" element={<OnboardingSuccessPage />} />

        {/* Routes with DefaultLayout */}
        <Route element={<DefaultLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/patients" element={<PatientsPage />} />
          <Route path="/profile" element={<ProfilePage />} />
        </Route>
      </Route>

      {/* System routes */}
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
}
