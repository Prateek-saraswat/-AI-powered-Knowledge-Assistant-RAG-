import { useEffect, useRef, useState } from "react";
import ChatMessage from "./ChatMessage";

export default function ChatWindow({ messages, onSend , disabled = false,
  disabledReason = ""}) {
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);

  const handleSend = () => {
    if (disabled) return;  

    if (!input.trim()) return;
    onSend(input);
    setInput("");
    setIsTyping(true);
    
    if (textareaRef.current) {
      textareaRef.current.style.height = "56px";
    }

    setTimeout(() => setIsTyping(false), 2000);
  };

  useEffect(() => {
    const scrollToBottom = () => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: "smooth", block: "end" });
      }
    };
    
    setTimeout(scrollToBottom, 100);
  }, [messages, isTyping]);

  const handleKeyPress = (e) => {
    if (disabled) return; 
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInput = (e) => {
    const target = e.target;
    target.style.height = "auto"; 
    const newHeight = Math.min(target.scrollHeight, 128); 
    target.style.height = `${Math.max(56, newHeight)}px`;
    setInput(target.value);
  };

  return (
    <div className=" scale-97 flex flex-col h-full w-full bg-slate-900/50 backdrop-blur-xl rounded-xl border border-white/5 overflow-hidden relative">
      
      {/* Header */}
      <div className="flex-shrink-0 px-6 py-5 border-b border-white/10 bg-slate-900/40 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="h-12 w-12 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-xl shadow-purple-500/20 border border-white/10">
              <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">AI Assistant</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${isTyping ? 'bg-purple-400' : 'bg-emerald-400'}`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${isTyping ? 'bg-purple-500' : 'bg-emerald-500'}`}></span>
                </span>
                <p className="text-sm text-slate-400 font-medium">
  {disabled
    ? "Document is processing…"
    : isTyping
      ? "Thinking..."
      : "Ready to help"}
</p>
              </div>
            </div>
          </div>
          <span className="px-3 py-1.5 bg-slate-800/50 text-slate-300 text-sm font-medium rounded-lg border border-slate-700/50">
            {messages.length} messages
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 min-h-0 overflow-y-auto p-6 space-y-8 custom-scrollbar scroll-smooth">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-6 py-12">
            <div className="h-24 w-24 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-6 border-2 border-dashed border-slate-700">
              <svg className="h-12 w-12 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-white mb-3">Start a Conversation</h4>
            <p className="text-slate-400 max-w-sm mx-auto leading-relaxed">
              Ask questions about your document to get instant, AI-powered insights and answers.
            </p>
          </div>
        ) : (
          <>
            {messages.map((msg, index) => (
              <ChatMessage key={index} message={msg} index={index} />
            ))}
            {isTyping && (
              <div className="flex justify-start animate-fadeIn pl-2">
                <div className="bg-slate-800/50 border border-slate-700 rounded-2xl rounded-tl-none p-4 shadow-sm">
                  <div className="flex gap-2">
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce"></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.15s" }}></div>
                    <div className="h-2 w-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.3s" }}></div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        <div ref={messagesEndRef} className="h-px" />
      </div>

      {/* Input Area */}
      <div className="flex-shrink-0 p-6 border-t border-white/10 bg-slate-900/40 backdrop-blur-sm">
        <div className="relative flex items-end gap-3">
          <div className="flex-1 relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl opacity-0 group-focus-within:opacity-50 transition duration-500 blur-md"></div>
            <textarea
              ref={textareaRef}
              // ref={textareaRef}
  placeholder={
    disabled
      ? disabledReason || "Document is processing…"
      : "Type your question here..."
  }
  value={input}
  // onChange={handleInput}
  // onKeyDown={handleKeyPress}
  disabled={disabled}
              // value={input}
              onChange={handleInput}
              onKeyDown={handleKeyPress}
              rows={1}
              className="relative w-full px-5 py-4 bg-slate-800/50 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 resize-none text-sm shadow-sm transition-all duration-300 custom-scrollbar"
              style={{ minHeight: "56px", maxHeight: "140px" }}
            />
          </div>

          <button
            onClick={handleSend}
            disabled={disabled || !input.trim()}
            className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-600 text-white rounded-xl hover:from-purple-600 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center flex-shrink-0 shadow-xl shadow-purple-500/20 hover:shadow-purple-500/30 transition-all duration-300 hover:-translate-y-0.5 active:scale-95"
          >
            <svg className="h-6 w-6" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
              <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}