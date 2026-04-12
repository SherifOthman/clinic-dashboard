import { Loading } from "@/core/components/ui/Loading";
import { useMe } from "@/features/auth/hooks";
import { Navigate, Outlet } from "react-router-dom";

export function RequireGuest() {
  const { isAuthenticated, isLoading } = useMe();

  if (isLoading) return <Loading className="h-screen" />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  return <Outlet />;
}

