import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import { adminAPI } from "../services/api";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [userDocuments, setUserDocuments] = useState([]);
  const [userQueries, setUserQueries] = useState([]);
  const [loadingUserData, setLoadingUserData] = useState(false);
  const [activeTab, setActiveTab] = useState("documents");
  const [hoveredUser, setHoveredUser] = useState(null);
  const navigate = useNavigate();

  // Helper to clean filename (remove UUID prefix)
  const getDisplayFilename = (filename) => {
    if (!filename) return "Untitled";
    
    const parts = filename.split("_");
    if (parts.length > 1 && parts[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return parts.slice(1).join("_");
    }
    
    return filename;
  };

  const loadUsers = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.users();
      setUsers(res.data.users);
    } catch (err) {
      console.error("Failed to load users:", err);
    } finally {
      setLoading(false);
    }
  };

  const loadUserDocuments = async (userId) => {
    setLoadingUserData(true);
    try {
      const res = await adminAPI.userDocuments(userId);
      setUserDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to load user documents:", err);
      setUserDocuments([]);
    } finally {
      setLoadingUserData(false);
    }
  };

  const loadUserQueries = async (userId) => {
    setLoadingUserData(true);
    try {
      const res = await adminAPI.userQueries(userId);
      setUserQueries(res.data.queries);
    } catch (err) {
      console.error("Failed to load user queries:", err);
      setUserQueries([]);
    } finally {
      setLoadingUserData(false);
    }
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setActiveTab("documents");
    loadUserDocuments(user._id);
    loadUserQueries(user._id);
  };

  const toggleDocument = async (docId) => {
    try {
      await adminAPI.toggleDocument(docId);
      if (selectedUser) {
        loadUserDocuments(selectedUser._id);
      }
    } catch (err) {
      alert("Failed to toggle document");
    }
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const filteredUsers = users.filter((user) =>
    user.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    if (!dateString) return "Never";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-6">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-96 bg-indigo-900/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Header */}
          <div className="mb-8 flex items-end justify-between">
            <div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">User Management</h1>
              <p className="text-slate-400 mt-2 text-sm font-medium">Manage user accounts, monitor activity, and control document access.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-180px)]">
            
            {/* Left Side - Users List */}
            <div className="lg:col-span-4 xl:col-span-3 flex flex-col h-full min-h-0">
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 flex flex-col h-full overflow-hidden">
                
                {/* List Header */}
                <div className="px-5 py-4 border-b border-white/5 bg-white/[0.02]">
                  <div className="flex items-center justify-between mb-4">
                    <h2 className="text-sm font-bold text-white uppercase tracking-wider flex items-center space-x-2">
                      <svg className="h-4 w-4 text-indigo-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>Users ({users.length})</span>
                    </h2>
                    <span className="bg-indigo-500/10 text-indigo-400 text-[10px] font-bold px-2 py-0.5 rounded-full border border-indigo-500/20">
                      {filteredUsers.length} Found
                    </span>
                  </div>

                  {/* Search */}
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-9 pr-4 py-2.5 text-sm bg-slate-950/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500/50 text-slate-200 placeholder-slate-500 transition-all duration-200"
                    />
                    <svg className="absolute left-3 top-3 h-4 w-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-3 h-4 w-4 text-slate-500 hover:text-white transition-colors"
                      >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="animate-spin h-6 w-6 border-2 border-slate-700 border-t-indigo-500 rounded-full"></div>
                      <p className="text-slate-500 text-xs">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <p className="text-slate-500 text-sm">No users found</p>
                    </div>
                  ) : (
                    filteredUsers.filter((user)=>user.role === 'user').map((user) => (
                      <div
                        key={user._id}
                        onClick={() => handleUserClick(user)}
                        onMouseEnter={() => setHoveredUser(user._id)}
                        onMouseLeave={() => setHoveredUser(null)}
                        className={`p-3 cursor-pointer rounded-xl transition-all duration-200 border ${
                          selectedUser?._id === user._id 
                            ? "bg-indigo-500/10 border-indigo-500/30 shadow-[0_0_15px_rgba(99,102,241,0.1)]" 
                            : "bg-transparent border-transparent hover:bg-white/5 hover:border-white/5"
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className={`h-9 w-9 rounded-lg flex items-center justify-center text-white font-bold text-xs shadow-lg transition-transform duration-200 ${
                            user.role === "admin" 
                              ? "bg-gradient-to-br from-rose-500 to-red-600" 
                              : "bg-gradient-to-br from-indigo-500 to-blue-600"
                          } ${hoveredUser === user._id ? 'scale-110' : ''}`}>
                            {user.email.slice(0, 2).toUpperCase()}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className={`font-semibold truncate text-sm transition-colors ${selectedUser?._id === user._id ? "text-white" : "text-slate-300"}`}>
                                {user.email}
                              </p>
                              {user.role === "admin" && (
                                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 shadow-[0_0_5px_rgba(244,63,94,0.5)]"></span>
                              )}
                            </div>
                            <div className="flex items-center space-x-3 mt-1 text-[10px] text-slate-500 font-medium uppercase tracking-wide">
                              <span>{user.documentCount} Docs</span>
                              <span className="text-slate-700">•</span>
                              <span>{user.queryCount} Queries</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - User Details */}
            <div className="lg:col-span-8 xl:col-span-9 flex flex-col h-full min-h-0">
              {selectedUser ? (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 flex flex-col h-full overflow-hidden animate-fadeIn">
                  
                  {/* User Header */}
                  <div className="relative bg-gradient-to-r from-slate-900 via-[#0f172a] to-slate-900 px-8 py-6 border-b border-white/5">
                    <div className="absolute inset-0 bg-indigo-500/5"></div>
                    <div className="relative flex items-start justify-between">
                      <div className="flex items-center space-x-5">
                        <div className={`h-16 w-16 rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-2xl ring-1 ring-white/10 ${
                          selectedUser.role === "admin" 
                            ? "bg-gradient-to-br from-rose-500 to-pink-600" 
                            : "bg-gradient-to-br from-indigo-500 to-violet-600"
                        }`}>
                          {selectedUser.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-2xl font-bold text-white tracking-tight">{selectedUser.email}</h2>
                          <div className="flex items-center space-x-4 mt-1.5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider border ${
                              selectedUser.role === "admin"
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}>
                              {selectedUser.role === "admin" ? "Administrator" : "Active User"}
                            </span>
                            <span className="text-xs text-slate-400 flex items-center">
                              <svg className="h-3 w-3 mr-1.5 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                              Joined {formatDate(selectedUser.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-4">
                         {/* Stat Cards */}
                        <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Docs</p>
                          <p className="text-xl font-bold text-white">{selectedUser.documentCount}</p>
                        </div>
                        <div className="text-center px-4 py-2 rounded-xl bg-white/5 border border-white/5">
                          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Queries</p>
                          <p className="text-xl font-bold text-white">{selectedUser.queryCount}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="flex items-center px-6 border-b border-white/5 bg-white/[0.02]">
                    <button
                      onClick={() => setActiveTab("documents")}
                      className={`relative py-4 px-6 text-sm font-medium transition-all duration-200 ${
                        activeTab === "documents"
                          ? "text-indigo-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        <span>Documents</span>
                      </span>
                      {activeTab === "documents" && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                      )}
                    </button>
                    <button
                      onClick={() => setActiveTab("queries")}
                      className={`relative py-4 px-6 text-sm font-medium transition-all duration-200 ${
                        activeTab === "queries"
                          ? "text-indigo-400"
                          : "text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <span className="flex items-center space-x-2">
                        <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>Query History</span>
                      </span>
                      {activeTab === "queries" && (
                        <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-indigo-500 shadow-[0_0_10px_rgba(99,102,241,0.5)]"></span>
                      )}
                    </button>
                  </div>

                  {/* Content Area */}
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {loadingUserData ? (
                      <div className="flex flex-col items-center justify-center h-full space-y-4">
                        <div className="animate-spin h-8 w-8 border-2 border-slate-700 border-t-indigo-500 rounded-full"></div>
                        <p className="text-slate-500 text-sm">Fetching data...</p>
                      </div>
                    ) : activeTab === "documents" ? (
                      <div className="space-y-3">
                        {userDocuments.length === 0 ? (
                          <div className="text-center py-20">
                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <p className="text-slate-400 font-medium">No documents found</p>
                          </div>
                        ) : (
                          userDocuments.map((doc) => (
                            <div 
                              key={doc._id} 
                              className="group bg-white/[0.02] rounded-xl p-4 border border-white/5 hover:border-indigo-500/30 hover:bg-white/[0.04] transition-all duration-200"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-4 flex-1 min-w-0">
                                  <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center border border-white/10 group-hover:border-indigo-500/30 transition-colors">
                                    <svg className="h-5 w-5 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-slate-200 truncate text-sm group-hover:text-white transition-colors">
                                      {getDisplayFilename(doc.filename)}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-1.5 text-[11px] text-slate-500 font-medium uppercase tracking-wide">
                                      <span>{formatDate(doc.createdAt)}</span>
                                      <span className="text-slate-700">•</span>
                                      <span className={`flex items-center space-x-1.5 ${doc.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                                        <span className={`h-1.5 w-1.5 rounded-full ${doc.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-slate-600'}`}></span>
                                        <span>{doc.enabled ? 'Active' : 'Disabled'}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleDocument(doc._id)}
                                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                    doc.enabled
                                      ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40"
                                      : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40"
                                  }`}
                                >
                                  {doc.enabled ? "Disable" : "Enable"}
                                </button>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {userQueries.length === 0 ? (
                          <div className="text-center py-20">
                            <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4">
                              <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <p className="text-slate-400 font-medium">No queries recorded</p>
                          </div>
                        ) : (
                          userQueries.map((query) => (
                            <div 
                              key={query.id} 
                              className="bg-white/[0.02] rounded-2xl p-5 border border-white/5 hover:border-indigo-500/20 transition-all duration-200 group"
                            >
                              <div className="mb-4">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="h-5 w-5 bg-indigo-500/20 rounded flex items-center justify-center">
                                    <svg className="h-3 w-3 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                  </div>
                                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Question</span>
                                </div>
                                <p className="text-slate-200 text-sm pl-7 leading-relaxed font-medium">
                                  {query.question}
                                </p>
                              </div>
                              <div className="pl-7 border-l border-white/10 ml-2.5">
                                <div className="flex items-center space-x-2 mb-1.5">
                                  <span className="text-[10px] font-bold text-purple-400 uppercase tracking-widest">AI Answer</span>
                                </div>
                                <p className="text-slate-400 text-sm leading-relaxed">{query.answer}</p>
                              </div>
                              <div className="flex items-center justify-end mt-4 pt-3 border-t border-white/5">
                                <p className="text-[10px] text-slate-500 font-mono flex items-center">
                                  <span>{formatDate(query.createdAt)}</span>
                                  <span className="mx-2">•</span>
                                  <span>ID: {query.id.slice(0, 8)}</span>
                                </p>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/5 h-full flex flex-col items-center justify-center p-8 text-center animate-fadeIn">
                  <div className="relative mb-6 group">
                    <div className="absolute inset-0 bg-indigo-500/20 rounded-full blur-xl group-hover:bg-indigo-500/30 transition-all duration-500"></div>
                    <div className="relative h-24 w-24 bg-slate-800 rounded-3xl flex items-center justify-center border border-white/10 shadow-2xl">
                      <svg className="h-10 w-10 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                    </div>
                  </div>
                  <h3 className="text-xl font-bold text-white mb-2">Select User Account</h3>
                  <p className="text-slate-400 max-w-sm mb-8 text-sm">Choose a user from the list on the left to view their complete profile, document history, and query logs.</p>
                  
                  <div className="flex items-center space-x-4 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
                    <span className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-indigo-500"></span>
                      <span>Profile</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
                      <span>Documents</span>
                    </span>
                    <span className="flex items-center space-x-2">
                      <span className="h-2 w-2 rounded-full bg-purple-500"></span>
                      <span>Logs</span>
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
          height: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(15, 23, 42, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(71, 85, 105, 0.5);
          border-radius: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.5);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </>
  );
}