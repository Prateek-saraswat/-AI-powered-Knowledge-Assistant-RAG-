import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Navbar from "../../components/Navbar";
import ChatWindow from "../../components/ChatWindow";
import { chatAPI } from "../../services/api";

export default function ChatPage() {
  const { documentId } = useParams();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadHistory = async () => {
    try {
      const res = await chatAPI.history(documentId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat history");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [documentId]);

  const sendQuestion = async (question) => {
    const tempMessage = {
      question,
      answer: "Thinking...",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const res = await chatAPI.ask({
        documentId,
        question,
      });

      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          question,
          answer: res.data.answer,
          createdAt: new Date().toISOString(),
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        {
          question,
          answer: "Error generating answer",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <>
      <Navbar />
      <div className="max-w-5xl mx-auto p-6">
        {loading ? (
          <p>Loading chat...</p>
        ) : (
          <ChatWindow messages={messages} onSend={sendQuestion} />
        )}
      </div>
    </>
  );
}
