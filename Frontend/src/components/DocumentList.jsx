import { useNavigate } from "react-router-dom";

export default function DocumentList({ documents }) {
  const navigate = useNavigate();

  if (!documents.length) {
    return <p className="text-gray-500">No documents uploaded yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {documents.map((doc) => (
        <div
          key={doc.documentId}
          className="border rounded p-4 bg-white shadow cursor-pointer hover:bg-gray-50"
          onClick={() => navigate(`/chat/${doc.documentId}`)}
        >
          <h3 className="font-semibold">{doc.filename}</h3>
          <p className="text-sm text-gray-500">
            Status: {doc.status}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {new Date(doc.createdAt).toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
}
