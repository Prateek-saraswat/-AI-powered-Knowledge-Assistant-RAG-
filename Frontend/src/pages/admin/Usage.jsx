import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminUsage() {
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const res = await adminAPI.usage();
        setUsage(res.data.usage);
      } catch (err) {
        console.error("Failed to load usage");
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">Token Usage</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Total Tokens</th>
              </tr>
            </thead>
            <tbody>
              {usage.map((u, index) => (
                <tr key={index}>
                  <td className="p-2 border">{u._id}</td>
                  <td className="p-2 border">{u.tokens}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
