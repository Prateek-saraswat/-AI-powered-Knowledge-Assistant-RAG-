import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";

export default function AdminDashboard() {
  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Link
            to="/admin/documents"
            className="p-6 bg-white shadow rounded hover:bg-gray-50"
          >
            <h2 className="font-semibold text-lg">Documents</h2>
            <p className="text-sm text-gray-500 mt-2">
              View & enable/disable user documents
            </p>
          </Link>

          <Link
            to="/admin/queries"
            className="p-6 bg-white shadow rounded hover:bg-gray-50"
          >
            <h2 className="font-semibold text-lg">User Queries</h2>
            <p className="text-sm text-gray-500 mt-2">
              Monitor all user questions & answers
            </p>
          </Link>

          <Link
            to="/admin/usage"
            className="p-6 bg-white shadow rounded hover:bg-gray-50"
          >
            <h2 className="font-semibold text-lg">Usage Analytics</h2>
            <p className="text-sm text-gray-500 mt-2">
              Track token usage per user
            </p>
          </Link>
        </div>
      </div>
    </>
  );
}
