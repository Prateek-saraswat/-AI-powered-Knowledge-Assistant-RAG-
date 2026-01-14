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
    setSelectedDocument(document);
    loadChatHistory(document.documentId || document.id || document._id);
    
    if (window.innerWidth < 1024) {
      setTimeout(() => {
        document.getElementById('chat-panel')?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    }
  };

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

      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-4 scale-100">
        
        <div className="fixed inset-0 w-full h-full pointer-events-none overflow-hidden z-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-500/10 rounded-2xl mix-blend-screen filter blur-[120px] animate-blob"></div>
          <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-2000"></div>
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-cyan-500/10 rounded-full mix-blend-screen filter blur-[120px] animate-blob animation-delay-4000"></div>
        </div>

        <div className="max-w-9xl mx-auto px-3 sm:px-6 lg:px-8 relative z-10">
          
          <div className="mb-3 animate-fadeIn ">
            <div className="flex items-center px-4 flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="text-center">
                <h1 className=" text-center text-2xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Document Chat</span>
                </h1>
                <p className="text-slate-400 flex items-center space-x-2 text-sm font-medium">
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Chat with your documents • {documents.length} files uploaded</span>
                </p>
              </div>
             
            </div>
          </div>

      
          

          <div className="grid grid-cols-1 lg:grid-cols-12 scale-97 gap-6 h-full">
            
          <div className="lg:col-span-4 xl:col-span-3 flex flex-col gap-6 ">
              
              <div className="max-w-[400px]  bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 p-6 flex-shrink-0 transition-all duration-300 hover:border-blue-500/30 hover:-translate-y-1 group animate-slideUp" style={{ animationDelay: "0.3s" }}>
                <div className="flex items-center gap-2 mb-3">
                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 border border-white/10 group-hover:scale-105 transition-transform duration-300">
                    <svg className="h-4 w-4 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-white tracking-tight">Upload Documents</h2>
                    <p className="text-sm text-slate-400 font-medium mt-1">PDF or Text files up to 10MB</p>
                  </div>
                </div>
                <UploadDocument onUploadSuccess={fetchDocuments} />
              </div>

              {/* Documents List */}
              <div className="max-h-[400px] scale-97 bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 flex-1 flex flex-col min-h-0 overflow-hidden transition-all duration-300 hover:border-purple-500/30 animate-slideUp" style={{ animationDelay: "0.4s" }}>
                <div className="px-6 py-4 border-b border-white/10 bg-slate-900/30 flex-shrink-0 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 bg-slate-800/50 rounded-xl flex items-center justify-center border border-white/10 shadow-sm">
                      <svg className="h-5 w-5 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </div>
                    <div>
                      <h2 className="text-sm font-bold text-white tracking-wide">Document Library</h2>
                      <p className="text-xs text-slate-400">Your uploaded files</p>
                    </div>
                  </div>
                  {!loading && (
                    <span className="px-2.5 py-1 bg-gradient-to-r from-blue-500 to-cyan-600 text-white text-xs font-bold rounded-lg shadow-sm">
                      {documents.filter((doc)=>doc.enabled).length}
                    </span>
                  )}
                </div>

                <div className="flex-1 overflow-y-auto p-4 custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-12">
                      <div className="relative mb-4">
                        <div className="h-10 w-10 border-[3px] border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                      </div>
                      <p className="text-slate-400 text-sm font-medium">Loading documents...</p>
                    </div>
                  ) : documents.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center p-8">
                      <div className="h-20 w-20 bg-slate-800/50 rounded-2xl flex items-center justify-center mb-4 border-2 border-dashed border-slate-700">
                        <svg className="h-8 w-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                        </svg>
                      </div>
                      <h3 className="text-slate-200 font-bold text-base mb-2">No documents yet</h3>
                      <p className="text-slate-500 text-sm">Upload a file to start chatting</p>
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
            <div id="chat-panel" className="lg:col-span-8 xl:col-span-9 flex flex-col h-[600px] max-h-[700px] lg:h-full">
              {selectedDocument ? (
                <div className="h-full flex flex-col min-h-0 gap-6 animate-slideUp" style={{ animationDelay: "0.5s" }}>
                  <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-xl border border-white/5 p-4 flex-shrink-0 flex items-center justify-between transition-all hover:border-cyan-500/30">
                    <div className="flex items-center gap-4 min-w-0">
                      <div className="h-12 w-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-xl shadow-emerald-500/20 border border-white/10">
                        <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="min-w-0">
                        <h3 className="text-lg font-bold text-white truncate tracking-tight">
                          {getDisplayFilename(selectedDocument.filename)}
                        </h3>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                          </span>
                          <span className="text-xs text-emerald-400 font-bold">Ready for analysis</span>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => setSelectedDocument(null)}
                      className="h-10 w-10 bg-slate-800 hover:bg-slate-700 rounded-xl flex items-center justify-center transition-all duration-300 border border-slate-700 hover:border-slate-600 hover:shadow-md group"
                    >
                      <svg className="h-5 w-5 text-slate-400 group-hover:text-slate-300 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>

                  {/* Chat Window Component */}
                  <div className="flex-1 min-h-0 overflow-hidden rounded-xl shadow-2xl border border-white/5 bg-slate-900/40 backdrop-blur-xl">
                    {loadingChat && (
                      <div className="absolute inset-0 flex items-center justify-center bg-slate-900/80 backdrop-blur-md z-50 rounded-3xl">
                        <div className="flex flex-col items-center">
                          <div className="h-10 w-10 border-[3px] border-slate-700 border-t-emerald-500 rounded-full animate-spin mb-3"></div>
                          <p className="text-slate-400 font-medium text-sm">Loading chat...</p>
                        </div>
                      </div>
                    )}
                    <ChatWindow messages={messages} onSend={sendQuestion} />
                  </div>
                </div>
              ) : (
                /* Welcome Screen */
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-xl shadow-2xl border border-white/5 h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                  <div className="max-w-xl">
                    {/* <div className="h-24 w-24 bg-linear-to-br from-indigo-500 via-purple-600 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-purple-500/20 border-4 border-slate-800 group hover:scale-110 transition-transform duration-500">
                      <svg className="h-12 w-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div> */}
                    
                    <h3 className="text-3xl font-bold text-white mb-4 tracking-tight">
                      Welcome to <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-cyan-400">Document Chat</span>
                    </h3>
                    <p className="text-slate-400 text-lg mb-12 max-w-md mx-auto leading-relaxed">
                      Upload your documents and chat with them using AI-powered insights.
                    </p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl mx-auto">
                      {[
                        { 
                          step: "1", 
                          title: "Upload", 
                          desc: "PDF or Text files", 
                          color: "from-blue-500 to-cyan-500" 
                        },
                        { 
                          step: "2", 
                          title: "Select", 
                          desc: "Choose a document", 
                          color: "from-purple-500 to-pink-500" 
                        },
                        { 
                          step: "3", 
                          title: "Chat", 
                          desc: "Ask questions", 
                          color: "from-emerald-500 to-teal-500" 
                        }
                      ].map((item, i) => (
                        <div key={i} className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700 hover:border-slate-600 transition-all duration-300 group hover:-translate-y-1">
                          <div className={`h-12 w-12 rounded-xl flex items-center justify-center mb-4 mx-auto font-bold text-lg shadow-lg ${item.color.startsWith('from-') ? `bg-gradient-to-br ${item.color}` : item.color} text-white group-hover:scale-110 transition-transform`}>
                            {item.step}
                          </div>
                          <p className="font-bold text-white text-sm mb-1">{item.title}</p>
                          <p className="text-xs text-slate-400">{item.desc}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Global Styles */}
      <style >{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: rgba(148, 163, 184, 0.3) transparent;
        }
        
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.3);
          border-radius: 3px;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(148, 163, 184, 0.3);
          border-radius: 3px;
          border: 2px solid transparent;
          background-clip: padding-box;
        }
        
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(148, 163, 184, 0.5);
        }
        
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        
        .animate-blob {
          animation: blob 15s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        
        @keyframes fadeIn { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        @keyframes slideUp { 
          from { opacity: 0; transform: translateY(20px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        
        .animate-fadeIn { animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .animate-slideUp { animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        
        .animation-delay-2000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 6s; }
      `}</style>
    </>
  );
}