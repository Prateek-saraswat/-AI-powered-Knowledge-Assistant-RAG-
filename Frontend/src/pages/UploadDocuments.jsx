import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const UploadDocument = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setError("Please select a file");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await api.post("/documents/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setMessage(
        `Document uploaded successfully (${res.data.filename})`
      );
      setFile(null);
    } catch (err) {
      setError(
        err.response?.data?.error || "Document upload failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Navbar />
      <form
        onSubmit={handleUpload}
        className="bg-white p-6 rounded-lg shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">
          Upload Document
        </h2>

        {error && (
          <p className="text-red-500 text-sm mb-3">{error}</p>
        )}

        {message && (
          <p className="text-green-600 text-sm mb-3">{message}</p>
        )}

        <input
          type="file"
          accept=".pdf,.txt"
          className="w-full border p-2 rounded mb-4"
          onChange={(e) => setFile(e.target.files[0])}
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

        <button
          type="button"
          onClick={() => navigate("/chat")}
          className="w-full mt-3 text-sm text-blue-600 underline"
        >
          Back to Chat
        </button>
      </form>
    </div>
  );
};

export default UploadDocument;
