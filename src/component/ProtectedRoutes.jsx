import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { decodeToken } from "../utils/auth";

export default function ProtectedRoute({ children }) {
  const token = useSelector((s) => s.auth.token);

  if (!token) return <Navigate to="/login" replace />;

  const decoded = decodeToken(token);
  if (!decoded) {
    // Token expired or invalid
    localStorage.removeItem("token");
    return <Navigate to="/login" replace />;
  }

  return children;
}
