export default function DocumentList({ documents, onDocumentClick, selectedDocument, hoveredDocId, setHoveredDocId }) {
  const getDisplayFilename = (filename) => {
    if (!filename) return "Untitled";
    const parts = filename.split("_");
    if (parts.length > 1 && parts[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return parts.slice(1).join("_");
    }
    return filename;
  };

  const getFileIcon = (filename) => {
    const ext = filename?.split(".").pop()?.toLowerCase();
    
    if (ext === "pdf") {
      return (
        <div className="h-8 w-8 bg-gradient-to-br from-red-500 to-pink-600 rounded-lg flex items-center justify-center shadow-sm shadow-red-500/20 border border-white/10">
          <svg className="h-4 w-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </div>
      );
    }
    
    return (
      <div className="h-8 w-8 bg-gradient-to-br from-slate-700 to-slate-800 rounded-lg flex items-center justify-center shadow-sm border border-white/10">
        <svg className="h-4 w-4 text-slate-300" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
    );
  };

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
      
      return date.toLocaleDateString("en-IN", { month: "short", day: "numeric" });
    } catch (e) {
      return "";
    }
  };

  return (
    <div className="space-y-2 pb-1 h-full">
      <div className="h-full overflow-y-auto pr-1 custom-scrollbar">
        {(documents || []).filter((doc) => doc.enabled !== false).map((doc) => {
          const isSelected = selectedDocument?.documentId === doc.documentId;
          const displayName = getDisplayFilename(doc.filename);
          const isHovered = hoveredDocId === doc.documentId;
          
          return (
            <button
              key={doc.documentId}
              onClick={() => onDocumentClick(doc)}
              onMouseEnter={() => setHoveredDocId(doc.documentId)}
              onMouseLeave={() => setHoveredDocId(null)}
              className={`w-full text-left p-4 rounded-xl transition-all duration-200 group mb-2 last:mb-0 ${
                isSelected
                  ? "bg-gradient-to-r from-blue-900/30 to-cyan-900/20 border border-blue-500/50 shadow-md shadow-blue-500/10"
                  : "bg-slate-800/40 backdrop-blur-sm border border-slate-700/50 hover:border-slate-600/50 hover:shadow-sm hover:shadow-slate-500/5"
              } ${isHovered && !isSelected ? 'scale-[1.01] bg-slate-800/60' : ''}`}
            >
              <div className="flex items-start gap-3">
                {getFileIcon(doc.filename)}
                
                <div className="flex-1 min-w-0">
                  <h4 className={`text-sm font-semibold truncate ${
                    isSelected ? "text-white" : "text-slate-200 group-hover:text-white"
                  }`}>
                    {displayName}
                  </h4>
                  
                  <div className="flex items-center gap-2 mt-1.5">
                    <span className={`text-xs flex items-center gap-1 ${
                      isSelected ? "text-blue-400" : "text-slate-400 group-hover:text-slate-300"
                    }`}>
                      <svg className="h-3 w-3 flex-shrink-0" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      {formatDate(doc.createdAt)}
                    </span>
                    
                    {doc.status === "processed" && (
                      <>
                        <span className="text-slate-600">•</span>
                        <span className={`flex items-center gap-1 px-2 py-0.5 text-xs font-medium rounded-full ${
                          isSelected 
                            ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/10 text-blue-400 border border-blue-500/30" 
                            : "bg-gradient-to-r from-emerald-500/20 to-green-500/10 text-emerald-400 border border-emerald-500/30"
                        }`}>
                          <div className={`h-1.5 w-1.5 rounded-full ${isSelected ? 'bg-blue-400' : 'bg-emerald-400'}`}></div>
                          Ready
                        </span>
                      </>
                    )}
                  </div>
                </div>

                {isSelected && (
                  <div className="flex-shrink-0">
                    <div className="h-7 w-7 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-md flex items-center justify-center shadow-sm shadow-blue-500/20">
                      <svg className="h-3.5 w-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
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
    </div>
  );
}