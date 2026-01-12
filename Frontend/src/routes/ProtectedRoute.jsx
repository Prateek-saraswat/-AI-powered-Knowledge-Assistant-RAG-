import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  // ⏳ Wait until auth state is restored
  if (loading) {
    return null; // or a loader
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🔐 Role-based protection
  if (role && user.role !== role) {
    return <Navigate to="/login" replace />;
  }

  return children;
}
