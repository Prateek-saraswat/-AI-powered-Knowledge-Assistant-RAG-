import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.documents();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = async (id) => {
    try {
      await adminAPI.toggleDocument(id);
      loadDocuments();
    } catch (err) {
      alert("Failed to toggle document");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <>
      <Navbar />
      <div className="max-w-6xl mx-auto p-6">
        <h1 className="text-xl font-bold mb-4">All Documents</h1>

        {loading ? (
          <p>Loading...</p>
        ) : (
          <table className="w-full border bg-white shadow rounded">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 border">Filename</th>
                <th className="p-2 border">User</th>
                <th className="p-2 border">Status</th>
                <th className="p-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {documents.map((doc) => (
                <tr key={doc._id}>
                  <td className="p-2 border">{doc.filename}</td>
                  <td className="p-2 border">{doc.userEmail}</td>
                  <td className="p-2 border">
                    {doc.enabled ? "Enabled" : "Disabled"}
                  </td>
                  <td className="p-2 border">
                    <button
                      onClick={() => toggleDocument(doc._id)}
                      className={`px-3 py-1 rounded text-white ${
                        doc.enabled
                          ? "bg-red-500 hover:bg-red-600"
                          : "bg-green-600 hover:bg-green-700"
                      }`}
                    >
                      {doc.enabled ? "Disable" : "Enable"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
