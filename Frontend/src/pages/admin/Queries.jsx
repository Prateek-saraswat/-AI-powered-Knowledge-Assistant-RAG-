import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const res = await adminAPI.queries();
        setQueries(res.data.queries);
      } catch (err) {
        console.error("Failed to load queries");
      } finally {
        setLoading(false);
      }
    };

    loadQueries();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">User Queries</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {queries.map((q, index) => (
              <div
                key={index}
                className="bg-white shadow p-4 rounded"
              >
                <p className="text-sm text-gray-500 mb-1">
                  {q.userEmail} •{" "}
                  {new Date(q.createdAt).toLocaleString()}
                </p>
                <p className="font-semibold">Q: {q.question}</p>
                <p className="mt-2 text-gray-700">A: {q.answer}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
