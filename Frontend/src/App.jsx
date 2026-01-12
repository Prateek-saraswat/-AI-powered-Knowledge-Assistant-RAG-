import { Routes, Route, Navigate } from "react-router-dom";

import Login from "./pages/Login";
import Signup from "./pages/Signup";

import ProtectedRoute from "./routes/ProtectedRoute";

import UserDashboard from "./pages/user/Dashboard";
import ChatPage from "./pages/user/ChatPage";

import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDocuments from "./pages/admin/Documents";
import AdminQueries from "./pages/admin/Queries";
import AdminUsage from "./pages/admin/Usage";

export default function App() {
  return (
    <Routes>
      {/* ================= PUBLIC ================= */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* ================= USER ================= */}
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute role="user">
            <UserDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:documentId"
        element={
          <ProtectedRoute role="user">
            <ChatPage />
          </ProtectedRoute>
        }
      />

      {/* ================= ADMIN ================= */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute role="admin">
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/documents"
        element={
          <ProtectedRoute role="admin">
            <AdminDocuments />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/queries"
        element={
          <ProtectedRoute role="admin">
            <AdminQueries />
          </ProtectedRoute>
        }
      />

      <Route
        path="/admin/usage"
        element={
          <ProtectedRoute role="admin">
            <AdminUsage />
          </ProtectedRoute>
        }
      />

      {/* ================= FALLBACK ================= */}
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}
