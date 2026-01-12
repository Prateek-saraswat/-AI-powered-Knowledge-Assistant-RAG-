import { useNavigate } from "react-router-dom";
import { removeToken } from "../utils/token";

const Navbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="bg-gray-800 text-white px-6 py-3 flex justify-between items-center">
      <h1
        className="font-bold cursor-pointer"
        onClick={() => navigate("/chat")}
      >
        AI Knowledge Assistant
      </h1>

      <div className="flex gap-4">
        <button onClick={() => navigate("/chat")}>Chat</button>
        <button onClick={() => navigate("/history")}>History</button>
        <button onClick={() => navigate("/upload")}>Upload</button>
        <button
          onClick={handleLogout}
          className="text-red-400 hover:text-red-500"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;
