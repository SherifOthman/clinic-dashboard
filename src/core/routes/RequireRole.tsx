import { Loading } from "@/core/components/ui/Loading";
import { canAccessRoute } from "@/core/utils/roleUtils";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Route guard that checks if user has required role to access a route
 * Redirects to /unauthorized if user doesn't have permission
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

  if (!canAccessRoute(user, location.pathname)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}

