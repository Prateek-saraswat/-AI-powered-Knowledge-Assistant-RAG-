import { useState } from "react";
import api from "../services/api";
import Navbar from "../components/Navbar";

const Chat = () => {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSend = async () => {
    if (!question.trim()) return;

    const userMessage = {
      type: "user",
      text: question
    };

    setMessages((prev) => [...prev, userMessage]);
    setQuestion("");
    setLoading(true);
    setError("");

    try {
      const res = await api.post("/chat/ask", {
        question
      });

      const aiMessage = {
        type: "ai",
        text: res.data.answer
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
        <Navbar />
      {/* Header */}
      <div className="bg-blue-600 text-white p-4 text-center font-semibold">
        AI Knowledge Assistant
      </div>

      {/* Chat Messages */}
      <div className="flex-1 p-4 overflow-y-auto">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-3 flex ${
              msg.type === "user" ? "justify-end" : "justify-start"
            }`}
          >
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                msg.type === "user"
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-800 border"
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm text-gray-500">AI is thinking...</p>
        )}

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      {/* Input Box */}
      <div className="p-4 bg-white flex gap-2 border-t">
        <input
          type="text"
          placeholder="Ask something..."
          className="flex-1 border rounded px-3 py-2"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />

        <button
          onClick={handleSend}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
