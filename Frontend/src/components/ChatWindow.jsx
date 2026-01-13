import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages, onSend }) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;
    onSend(input);
    setInput("");
    setIsTyping(true);
    setTimeout(() => setIsTyping(false), 2000);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
      
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 rounded-t-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-white font-semibold text-base">AI Assistant</h3>
              <div className="flex items-center space-x-2">
                <div className="h-1.5 w-1.5 bg-green-400 rounded-full animate-pulse"></div>
                <p className="text-blue-100 text-xs">{isTyping ? "Typing..." : "Online"}</p>
              </div>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-xs font-medium rounded-full">
              {messages.length} {messages.length === 1 ? "message" : "messages"}
            </span>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 bg-gradient-to-b from-gray-50/50 to-gray-100/50 min-h-0 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-4">
            <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
              <svg className="h-10 w-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-base font-semibold text-gray-800 mb-2">Start a Conversation</h4>
            <p className="text-sm text-gray-500 max-w-md mb-6">Ask me anything about your document. I can answer questions, summarize content, and help you understand the material.</p>
            <div className="flex items-center space-x-4 text-xs text-gray-400">
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Accurate</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>Fast</span>
              </span>
              <span className="text-gray-300">•</span>
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <span>Secure</span>
              </span>
            </div>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} index={index} />
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="flex items-start space-x-3">
                  <div className="h-10 w-10 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg bg-gradient-to-br from-purple-600 to-purple-700">
                    <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                    </svg>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
                    <div className="flex space-x-2">
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse"></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.2s" }}></div>
                      <div className="h-2 w-2 bg-gray-400 rounded-full animate-pulse" style={{ animationDelay: "0.4s" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-200 p-4 bg-gradient-to-r from-white to-gray-50">
        <div className="relative">
          <div className="flex items-end space-x-2">
            <div className="flex-1 relative">
              <textarea
                placeholder="Ask a question about your document..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
                rows="1"
                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:outline-none focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 resize-none max-h-32 text-sm shadow-sm hover:shadow transition-shadow"
                style={{ minHeight: "44px" }}
                onInput={(e) => {
                  e.target.style.height = "auto";
                  e.target.style.height = e.target.scrollHeight + "px";
                }}
              />
              <div className="absolute bottom-3 right-3 flex items-center space-x-2">
                <span className="text-xs text-gray-400">
                  {input.length}/1000
                </span>
              </div>
            </div>

            <button
              onClick={handleSend}
              disabled={!input.trim()}
              className="group h-11 w-11 bg-gradient-to-br from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-3 focus:ring-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <svg className="h-5 w-5 group-hover:scale-110 transition-transform" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>

          <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center space-x-2">
              <span className="flex items-center space-x-1">
                <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                <span>AI-Powered</span>
              </span>
              <span className="text-gray-300">•</span>
              <span>Press Enter to send</span>
            </span>
            <span>Shift + Enter for new line</span>
          </div>
        </div>
      </div>
    </div>
  );
}