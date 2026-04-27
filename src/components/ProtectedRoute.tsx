import { Navigate, useLocation } from "react-router-dom";
import { ReactNode } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRole: UserRole;
}

const ProtectedRoute = ({ children, allowedRole }: ProtectedRouteProps) => {
  const { isAuthenticated, userRole } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (userRole !== allowedRole) {
    return <Navigate to="/" replace />;
  }
  return <>{children}</>;
};

export default ProtectedRoute;
