import { Navigate, useLocation } from "react-router-dom";
import { getCurrentUserRole, isAuthenticated } from "../utils/auth";

const PrivateRoute = ({ children, allowedRoles = [] }) => {
  const location = useLocation();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowedRoles.length > 0) {
    const role = getCurrentUserRole();
    if (!allowedRoles.includes(role)) {
      return <Navigate to="/dashboard" replace state={{ message: "You are not authorized" }} />;
    }
  }

  return children;
};

export default PrivateRoute;
