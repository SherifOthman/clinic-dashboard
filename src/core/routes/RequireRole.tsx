import { Loading } from "@/core/components/ui/Loading";
import { siteConfig } from "@/core/config";
import {
  canAccessRoute,
  canAccessRouteWithPermissions,
} from "@/core/utils/permissions";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard that checks:
 * 1. Role access (ROUTE_ACCESS) — coarse-grained, e.g. only ClinicOwner can see /staff
 * 2. Permission access — fine-grained, e.g. user must have ViewPatients to see /patients
 *
 * If either check fails → redirect to /unauthorized.
 */
export function RequireRole() {
  const { user, isLoading } = useMe();
  const location = useLocation();

  if (isLoading) {
    return <Loading className="h-screen" />;
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Role check
  if (!canAccessRoute(user, location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Permission check — look up the requiredPermission for this route from siteConfig
  const sidebarItem = siteConfig.sidebarItems.find(
    (item) => item.href === location.pathname,
  );
  const requiredPermission = sidebarItem?.requiredPermission ?? null;

  if (
    !canAccessRouteWithPermissions(user, location.pathname, requiredPermission)
  ) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
