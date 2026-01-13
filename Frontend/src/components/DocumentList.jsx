export default function DocumentList({ documents, onDocumentClick, selectedDocument, hoveredDocId, setHoveredDocId }) {
  
    // Helper function to clean filename (remove UUID prefix)
    const getDisplayFilename = (filename) => {
      if (!filename) return "Untitled";
      
      // Remove UUID prefix (format: uuid_filename.ext)
      const parts = filename.split("_");
      if (parts.length > 1 && parts[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
        return parts.slice(1).join("_");
      }
      
      return filename;
    };
  
    // Get file extension icon
    const getFileIcon = (filename) => {
      const ext = filename?.split(".").pop()?.toLowerCase();
      
      if (ext === "pdf") {
        return (
          <svg className="h-5 w-5 text-red-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        );
      }
      
      return (
        <svg className="h-5 w-5 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      );
    };
  
    // Format date
    const formatDate = (dateString) => {
      if (!dateString) return "";
      
      try {
        const date = new Date(dateString);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);
  
        if (diffMins < 1) return "Just now";
        if (diffMins < 60) return `${diffMins}m ago`;
        if (diffHours < 24) return `${diffHours}h ago`;
        if (diffDays < 7) return `${diffDays}d ago`;
        
        return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      } catch (e) {
        return "";
      }
    };
  
    return (
      <div className="space-y-3">
        {documents.map((doc) => {
          const isSelected = selectedDocument?.documentId === doc.documentId;
          const displayName = getDisplayFilename(doc.filename);
          const isHovered = hoveredDocId === doc.documentId;
          
          return (
            <button
              key={doc.documentId}
              onClick={() => onDocumentClick(doc)}
              onMouseEnter={() => setHoveredDocId(doc.documentId)}
              onMouseLeave={() => setHoveredDocId(null)}
              className={`w-full text-left p-4 rounded-xl border transition-all duration-300 group ${
                isSelected
                  ? "bg-gradient-to-r from-blue-50/80 to-blue-100/50 border-blue-300 shadow-md transform -translate-y-0.5"
                  : "bg-white border-gray-200 hover:border-gray-300 hover:shadow-lg hover:-translate-y-0.5"
              } ${isHovered ? 'scale-[1.02]' : ''}`}
            >
              <div className="flex items-start space-x-3">
                <div className={`h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-all duration-300 shadow-sm ${
                  isSelected 
                    ? "bg-gradient-to-br from-blue-500 to-blue-600 scale-110" 
                    : "bg-gradient-to-br from-gray-100 to-gray-200 group-hover:from-gray-200 group-hover:to-gray-300"
                }`}>
                  {getFileIcon(doc.filename)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate transition-colors ${
                    isSelected ? "text-blue-900" : "text-gray-900 group-hover:text-gray-800"
                  }`}>
                    {displayName}
                  </h4>
                  
                  <div className="flex items-center space-x-3 mt-1.5">
                    <span className={`text-xs transition-colors flex items-center space-x-1 ${
                      isSelected ? "text-blue-600" : "text-gray-500 group-hover:text-gray-600"
                    }`}>
                      <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{formatDate(doc.createdAt)}</span>
                    </span>
                    
                    {doc.status === "processed" && (
                      <>
                        <span className="text-gray-300">•</span>
                        <span className="flex items-center space-x-1 px-2 py-0.5 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                          <div className={`h-1.5 w-1.5 bg-green-500 rounded-full ${isSelected ? 'animate-pulse' : ''}`}></div>
                          <span>Ready</span>
                        </span>
                      </>
                    )}
                  </div>
                </div>
  
                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-md">
                      <svg className="h-4 w-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
            </button>
          );
        })}
      </div>
    );
  }