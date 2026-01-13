import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import UploadDocument from "../../components/UploadDocument";
import DocumentList from "../../components/DocumentList";
import ChatWindow from "../../components/ChatWindow";
import { documentAPI, chatAPI } from "../../services/api";

export default function Dashboard() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loadingChat, setLoadingChat] = useState(false);
  const [hoveredDocId, setHoveredDocId] = useState(null);

  const fetchDocuments = async () => {
    setLoading(true);
    try {
      const res = await documentAPI.list();
      console.log(res.data.documents);
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to load documents", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  const loadChatHistory = async (documentId) => {
    setLoadingChat(true);
    try {
      const res = await chatAPI.history(documentId);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error("Failed to load chat history", err);
      setMessages([]);
    } finally {
      setLoadingChat(false);
    }
  };

  const handleDocumentClick = (document) => {
    console.log(document);
    setSelectedDocument(document);
    loadChatHistory(document.documentId || document.id || document._id);
  };

  // Helper to clean filename (remove UUID prefix)
  const getDisplayFilename = (filename) => {
    if (!filename) return "Untitled";
    
    const parts = filename.split("_");
    if (parts.length > 1 && parts[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return parts.slice(1).join("_");
    }
    
    return filename;
  };

  const sendQuestion = async (question) => {
    if (!selectedDocument) return;

    const tempMessage = {
      question,
      answer: "Thinking...",
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);

    try {
      const docId = selectedDocument.documentId || selectedDocument.id || selectedDocument._id;
      console.log("💬 Sending question for documentId:", docId);
      
      const res = await chatAPI.ask({
        documentId: docId,
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
          answer: "Error generating answer. Please try again.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <div className="max-w-7xl mx-auto p-4 sm:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-96px)]">
            
            {/* Left Sidebar - Documents */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col space-y-6 h-full">
              
              {/* Upload Section */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                <div className="p-5">
                  <div className="flex items-center space-x-3 mb-4">
                    <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                      <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-gray-900">Upload Document</h2>
                      <p className="text-xs text-gray-500">PDF or text files</p>
                    </div>
                  </div>
                  <UploadDocument onUploadSuccess={fetchDocuments} />
                </div>
              </div>

              {/* Documents List */}
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 flex-1 flex flex-col min-h-0 overflow-hidden">
                <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-9 w-9 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div>
                        <h2 className="text-sm font-semibold text-gray-900">Documents</h2>
                        <p className="text-xs text-gray-500">Your uploaded files</p>
                      </div>
                    </div>
                    {!loading && (
                      <span className="px-3 py-1 bg-gradient-to-r from-blue-50 to-blue-100 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
                        {documents.length} files
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 min-h-0 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-4">
                      <div className="relative">
                        <div className="h-12 w-12 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="h-6 w-6 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                        </div>
                      </div>
                      <div>
                        <p className="text-gray-700 text-sm font-medium text-center">Loading documents...</p>
                        <p className="text-gray-500 text-xs text-center mt-1">Fetching your files</p>
                      </div>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-4">
                      <div className="h-16 w-16 bg-gradient-to-br from-gray-100 to-gray-200 rounded-2xl flex items-center justify-center mb-4 shadow-inner">
                        <svg className="h-8 w-8 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <h3 className="text-gray-700 font-medium text-sm mb-2">No documents yet</h3>
                      <p className="text-gray-500 text-xs mb-4">Upload your first document to get started</p>
                      <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full opacity-20"></div>
                    </div>
                  ) : (
                    <DocumentList
                      documents={documents}
                      onDocumentClick={handleDocumentClick}
                      selectedDocument={selectedDocument}
                      hoveredDocId={hoveredDocId}
                      setHoveredDocId={setHoveredDocId}
                    />
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - Chat Window */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col min-h-0">
              {selectedDocument ? (
                <div className="h-full flex flex-col min-h-0 space-y-4">
                  {/* Document Header */}
                  <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4 min-w-0 flex-1">
                        <div className={`h-12 w-12 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${hoveredDocId === selectedDocument.documentId ? 'scale-110' : ''} transition-transform duration-200`}>
                          <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-lg font-bold text-gray-900 truncate">
                            {getDisplayFilename(selectedDocument.filename)}
                          </h3>
                          <div className="flex items-center space-x-3 mt-1">
                            <span className="text-sm text-gray-600">Chat with your document</span>
                            <span className="flex items-center space-x-1 px-2 py-1 bg-green-50 text-green-700 text-xs font-medium rounded-full">
                              <div className="h-1.5 w-1.5 bg-green-500 rounded-full animate-pulse"></div>
                              <span>Ready</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedDocument(null)}
                        className="group h-10 w-10 bg-gradient-to-br from-gray-100 to-gray-200 hover:from-gray-200 hover:to-gray-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-md hover:shadow-lg transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <svg className="h-5 w-5 text-gray-600 group-hover:text-gray-800 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Chat Window */}
                  <div className="flex-1 min-h-0">
                    {loadingChat ? (
                      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 h-full flex items-center justify-center">
                        <div className="text-center space-y-4">
                          <div className="relative">
                            <div className="h-14 w-14 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="h-7 w-7 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                            </div>
                          </div>
                          <div>
                            <p className="text-gray-700 font-medium text-sm">Loading chat history...</p>
                            <p className="text-gray-500 text-xs mt-1">Retrieving your conversations</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <ChatWindow messages={messages} onSend={sendQuestion} />
                    )}
                  </div>
                </div>
              ) : (
                /* Welcome Screen */
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 h-full flex items-center justify-center p-8">
                  <div className="text-center max-w-lg">
                    <div className="h-20 w-20 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-inner">
                      <svg className="h-10 w-10 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <h3 className="text-2xl font-bold text-gray-900 mb-3">Welcome to DocChat AI</h3>
                    <p className="text-gray-600 text-sm mb-8 max-w-md mx-auto">Select a document from the sidebar to start an intelligent conversation with your content</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">1</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Upload document</p>
                            <p className="text-xs text-gray-500">PDF or text files</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-purple-600 to-purple-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">2</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Select document</p>
                            <p className="text-xs text-gray-500">Click to open chat</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-emerald-300 hover:shadow-md transition-all duration-300 hover:-translate-y-1">
                        <div className="flex items-center space-x-3 mb-3">
                          <div className="h-10 w-10 bg-gradient-to-br from-emerald-600 to-emerald-700 rounded-xl flex items-center justify-center shadow-lg">
                            <span className="text-white font-bold text-sm">3</span>
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900 text-sm">Ask questions</p>
                            <p className="text-xs text-gray-500">Get AI answers instantly</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="w-48 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full mx-auto opacity-50"></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #c1c1c1;
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #a1a1a1;
        }
      `}</style>
    </>
  );
}