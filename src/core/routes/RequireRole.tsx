import { Loading } from "@/core/components/ui/Loading";
import { siteConfig } from "@/core/config";
import { canAccessRouteWithPermissions } from "@/core/utils/permissions";
import { canAccessOnboarding } from "@/core/utils/authNavigation";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard — two checks in one pass:
 *
 * 1. Role gate (via ROUTE_ACCESS in constants):
 *    Coarse-grained structural access — e.g. only ClinicOwner sees /staff,
 *    only SuperAdmin sees /audit. ClinicOwner bypasses all permission checks.
 *
 * 2. Permission gate (via siteConfig.sidebarItems.requiredPermission):
 *    Fine-grained feature access for staff members — e.g. a receptionist
 *    needs ViewPatients to see /patients.
 *
 * Why keep roles at all?
 *   - ClinicOwner has no permissions in the DB (implicit full access).
 *     Without the role check they'd be blocked from every permission-gated route.
 *   - SuperAdmin is cross-clinic with no MemberId/permissions — role-only.
 *   - Onboarding gate is role+state: isClinicOwner && !onboardingCompleted.
 *   Roles and permissions answer different questions and must coexist.
 */
export function RequireRole() {
  const { user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) return <Loading className="h-screen" />;
  if (!user)     return <Navigate to="/unauthorized" replace />;

  // Clinic owner who hasn't completed onboarding → send to wizard
  if (canAccessOnboarding(user)) return <Navigate to="/onboarding" replace />;

  // Combined role + permission check (canAccessRouteWithPermissions calls canAccessRoute internally)
  const requiredPermission =
    siteConfig.sidebarItems.find((item) => item.href === location.pathname)
      ?.requiredPermission ?? null;

  if (!canAccessRouteWithPermissions(user, location.pathname, requiredPermission)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
