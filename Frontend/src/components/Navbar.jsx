import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="flex justify-between items-center px-6 py-4 bg-gray-900 text-white">
      <h1
        className="text-xl font-bold cursor-pointer"
        onClick={() =>
          navigate(user.role === "admin" ? "/admin" : "/dashboard")
        }
      >
        AI Knowledge Assistant
      </h1>

      <div className="flex items-center gap-4">
        <span className="text-sm">{user.email}</span>
        <button
          onClick={handleLogout}
          className="bg-red-500 px-4 py-1 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
