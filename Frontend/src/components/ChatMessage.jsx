export default function ChatMessage({ message }) {
    return (
      <div className="mb-4">
        {/* User question */}
        <div className="flex justify-end mb-1">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-lg max-w-[70%]">
            {message.question}
          </div>
        </div>
  
        {/* AI answer */}
        <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-900 px-4 py-2 rounded-lg max-w-[70%]">
            {message.answer}
          </div>
        </div>
      </div>
    );
  }
  