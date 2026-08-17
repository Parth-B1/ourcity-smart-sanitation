import type { ReactNode } from "react";
import { Navigate, useLocation } from "react-router-dom";

import {
  getStoredUser,
  getToken,
  type UserRole,
} from "../../services/authService";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
}

function getHomeForRole(role: UserRole) {
  switch (role) {
    case "nmc_officer":
      return "/dashboard";

    case "truck_operator":
      return "/truck";

    case "citizen":
    default:
      return "/";
  }
}

function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const location = useLocation();

  const token = getToken();
  const user = getStoredUser();

  // Not logged in
  if (!token || !user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Logged in, but wrong role
  if (
    allowedRoles &&
    !allowedRoles.includes(user.role)
  ) {
    return (
      <Navigate
        to={getHomeForRole(user.role)}
        replace
      />
    );
  }

  return <>{children}</>;
}

export default ProtectedRoute;