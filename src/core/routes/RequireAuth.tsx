import { Loading } from "@/core/components/ui/Loading";
import { canAccessOnboarding, getAuthenticatedUserRoute } from "@/core/utils/authNavigation";
import { useEnsureClinicOwnerToken, useMe } from "@/features/auth/hooks";
import { useRef } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";

const AUTH_URL = (import.meta.env.VITE_AUTH_URL as string | undefined)
  ?? "https://clinic-website-lime.vercel.app/en/login";

export function RequireAuth() {
  const { user, isLoading } = useMe();
  const location = useLocation();
  const redirecting = useRef(false);

  // Silently refresh the JWT for onboarded clinic owners so ClinicId claim is present
  useEnsureClinicOwnerToken(user);

  if (isLoading) return <Loading className="h-screen" />;

  // Not authenticated → redirect to Next.js login page (hard nav, cross-origin)
  if (!user) {
    if (!redirecting.current) {
      redirecting.current = true;
      window.location.replace(AUTH_URL);
    }
    return null; // blank while browser navigates — no flicker
  }

  const isOnOnboardingPage = location.pathname.startsWith("/onboarding");

  if (isOnOnboardingPage) {
    if (!canAccessOnboarding(user)) return <Navigate to="/dashboard" replace />;
    return <Outlet />;
  }

  const requiredRoute = getAuthenticatedUserRoute(user);
  if (requiredRoute !== "/dashboard") return <Navigate to={requiredRoute} replace />;

  return <Outlet />;
}
