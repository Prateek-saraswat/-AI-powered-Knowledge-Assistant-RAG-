import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import UploadDocument from "../../components/UploadDocument";
import DocumentList from "../../components/DocumentList";
import { documentAPI } from "../../services/api";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentAPI.list();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <>
      <Navbar />

      <div className="max-w-6xl mx-auto p-6">
        <UploadDocument onUploadSuccess={fetchDocuments} />

        <h2 className="text-xl font-semibold mt-8 mb-4">
          Your Documents
        </h2>

        {loading ? (
          <p>Loading documents...</p>
        ) : (
          <DocumentList documents={documents} />
        )}
      </div>
    </>
  );
}
