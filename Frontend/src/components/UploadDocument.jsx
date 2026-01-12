import { useState } from "react";
import { documentAPI } from "../services/api";

export default function UploadDocument({ onUploadSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a file");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("file", file); // 🔥 KEY MUST BE "file"

      await documentAPI.upload(formData);

      setFile(null);
      onUploadSuccess && onUploadSuccess();
    } catch (err) {
      setError(err.response?.data?.error || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="border p-4 rounded bg-white shadow">
      <h3 className="font-semibold mb-3">Upload Document</h3>

      {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

      <input
        type="file"
        accept=".pdf,.txt"
        onChange={(e) => setFile(e.target.files[0])}
        className="mb-3"
      />

      <button
        onClick={handleUpload}
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Uploading..." : "Upload"}
      </button>
    </div>
  );
}
