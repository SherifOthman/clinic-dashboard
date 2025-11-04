// import { useLocation, Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  // const location = useLocation();

  // if (!isAuthenticated()) {
  //   return <Navigate to="/login" state={{ from: location }} replace />;
  // }
  return <>{children}</>;
}
