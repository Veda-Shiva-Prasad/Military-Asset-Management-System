import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return allowedRoles.includes(user.role) ? (
    <Outlet />
  ) : (
    <Navigate to="/dashboard" replace />
  );
};

export default RoleRoute;
