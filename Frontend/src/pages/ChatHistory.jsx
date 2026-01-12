import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const ChatHistory = () => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await api.get("/chat/history");
        setMessages(res.data.messages || []);
      } catch (err) {
        setError(err.response?.data?.error || "Failed to load history");
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
        <Navbar />
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Chat History</h2>
        <button
          onClick={() => navigate("/chat")}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Back to Chat
        </button>
      </div>

      {/* Loading */}
      {loading && (
        <p className="text-gray-500">Loading chat history...</p>
      )}

      {/* Error */}
      {error && (
        <p className="text-red-500">{error}</p>
      )}

      {/* History List */}
      {!loading && !error && messages.length === 0 && (
        <p className="text-gray-500">No chat history found.</p>
      )}

      <div className="space-y-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded shadow"
          >
            <p className="font-semibold text-gray-800 mb-1">
              Q: {msg.question}
            </p>
            <p className="text-gray-700">
              A: {msg.answer}
            </p>

            <p className="text-xs text-gray-400 mt-2">
              {new Date(msg.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChatHistory;
