export default function ChatMessage({ message, index }) {
  
    const formatTime = (dateString) => {
      if (!dateString) return "";
      
      try {
        const date = new Date(dateString);
        return date.toLocaleTimeString("en-US", { 
          hour: "numeric", 
          minute: "2-digit",
          hour12: true 
        });
      } catch (e) {
        return "";
      }
    };
  
    return (
      <div className="space-y-4">
        {/* User Question */}
        <div className="flex justify-end">
          <div className="flex items-end space-x-3 max-w-[85%] group">
            <div className="order-2 h-10 w-10 rounded-xl bg-gradient-to-br from-blue-600 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div className="order-1 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl rounded-br-sm shadow-lg p-4 group-hover:shadow-xl transition-all duration-200">
              <p className="text-sm text-white whitespace-pre-wrap break-words leading-relaxed">
                {message.question}
              </p>
            </div>
          </div>
        </div>
  
        {/* AI Answer */}
        <div className="flex justify-start">
          <div className="flex items-start space-x-3 max-w-[85%] group">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-purple-700 flex items-center justify-center flex-shrink-0 shadow-lg group-hover:scale-105 transition-transform duration-200">
              <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl rounded-tl-sm shadow-lg border border-gray-200 p-4 group-hover:shadow-xl transition-all duration-200">
                <p className="text-sm text-gray-800 whitespace-pre-wrap break-words leading-relaxed">
                  {message.answer}
                </p>
              </div>
              {message.createdAt && (
                <div className="flex items-center space-x-2 mt-2 ml-1">
                  <p className="text-xs text-gray-400">
                    {formatTime(message.createdAt)}
                  </p>
                  <span className="text-gray-300 text-xs">•</span>
                  <span className="text-xs text-gray-400 flex items-center space-x-1">
                    <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>AI Response</span>
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }