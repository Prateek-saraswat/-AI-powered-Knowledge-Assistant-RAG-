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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">User Management</h1>
            <p className="text-gray-600 mt-1">Manage user accounts, documents, and query history</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Side - Users List */}
            <div className="lg:col-span-4 xl:col-span-3">
              <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-150px)] flex flex-card overflow-hidden transition-all duration-300 hover:shadow-xl">
                
                {/* Header */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-5 py-4 rounded-t-xl flex-shrink-0">
                  <div className="flex items-center justify-between">
                    <h2 className="text-base font-semibold text-white flex items-center space-x-2">
                      <svg className="h-5 w-5" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                      </svg>
                      <span>All Users ({users.length})</span>
                    </h2>
                    <span className="bg-white/20 text-white/90 text-xs font-medium px-2 py-1 rounded-full">
                      {filteredUsers.length} filtered
                    </span>
                  </div>
                </div>

                {/* Search */}
                <div className="p-4 border-b border-gray-100 flex-shrink-0">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search users by email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 text-sm border border-gray-300 rounded-lg focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white"
                    />
                    <svg className="absolute left-3 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3 top-3.5 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Users List */}
                <div className="flex-1 overflow-y-auto custom-scrollbar">
                  {loading ? (
                    <div className="flex flex-col items-center justify-center py-12 space-y-3">
                      <div className="animate-spin h-8 w-8 border-3 border-gray-200 border-t-blue-600 rounded-full"></div>
                      <p className="text-gray-500 text-sm">Loading users...</p>
                    </div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-10 px-4">
                      <div className="h-12 w-12 text-gray-300 mx-auto mb-3">
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                        </svg>
                      </div>
                      <p className="text-gray-500 text-sm">No users found</p>
                      {searchTerm && (
                        <p className="text-gray-400 text-xs mt-1">Try a different search term</p>
                      )}
                    </div>
                  ) : (
                    <div className="p-2 space-y-1">
                      {filteredUsers.map((user) => (
                        <div
                          key={user._id}
                          onClick={() => handleUserClick(user)}
                          onMouseEnter={() => setHoveredUser(user._id)}
                          onMouseLeave={() => setHoveredUser(null)}
                          className={`p-3 cursor-pointer rounded-lg transition-all duration-200 ${
                            selectedUser?._id === user._id 
                              ? "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500 shadow-sm" 
                              : "hover:bg-gray-50 hover:shadow-sm"
                          } ${hoveredUser === user._id ? 'scale-[1.01]' : ''}`}
                        >
                          <div className="flex items-center space-x-3">
                            <div className={`h-10 w-10 rounded-xl flex items-center justify-center text-white font-semibold text-sm shadow-lg transition-transform duration-200 ${
                              user.role === "admin" 
                                ? "bg-gradient-to-br from-red-500 to-red-600" 
                                : "bg-gradient-to-br from-blue-500 to-indigo-600"
                            } ${hoveredUser === user._id ? 'scale-105' : ''}`}>
                              {user.email.slice(0, 2).toUpperCase()}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center justify-between">
                                <p className="font-medium text-gray-900 truncate text-sm">
                                  {user.email}
                                  {user.role === "admin" && (
                                    <span className="ml-2 px-2 py-0.5 bg-red-100 text-red-700 text-xs font-medium rounded-full">
                                      Admin
                                    </span>
                                  )}
                                </p>
                                <div className="flex items-center space-x-2 text-xs text-gray-500">
                                  <span className="flex items-center space-x-1">
                                    <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                    <span>{user.documentCount}</span>
                                  </span>
                                  <span className="text-gray-300">•</span>
                                  <span className="flex items-center space-x-1">
                                    <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                    </svg>
                                    <span>{user.queryCount}</span>
                                  </span>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2 mt-1 text-xs text-gray-500">
                                <span className="flex items-center space-x-1">
                                  <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>{formatDate(user.createdAt)}</span>
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Right Side - User Details */}
            <div className="lg:col-span-8 xl:col-span-9">
              {selectedUser ? (
                <div className="bg-white rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-150px)] flex flex-col overflow-hidden transition-all duration-300">
                  
                  {/* User Header */}
                  <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-5 rounded-t-xl flex-shrink-0">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className={`h-12 w-12 rounded-xl flex items-center justify-center text-white font-semibold text-lg shadow-lg ${
                          selectedUser.role === "admin" 
                            ? "bg-gradient-to-br from-red-500 to-red-600" 
                            : "bg-white/20 backdrop-blur-sm"
                        }`}>
                          {selectedUser.email.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-white">{selectedUser.email}</h2>
                          <div className="flex items-center space-x-3 mt-1 text-blue-100 text-sm">
                            <span className="flex items-center space-x-1">
                              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                              </svg>
                              <span>Joined: {formatDate(selectedUser.createdAt)}</span>
                            </span>
                            <span className="text-white/50">•</span>
                            <span className="flex items-center space-x-1">
                              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>Last: {formatDate(selectedUser.lastLogin)}</span>
                            </span>
                          </div>
                        </div>
                      </div>
                      <button
                        onClick={() => setSelectedUser(null)}
                        className="h-9 w-9 bg-white/20 hover:bg-white/30 rounded-lg flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
                      >
                        <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-4 gap-3">
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] cursor-default">
                        <p className="text-blue-100 text-xs font-medium mb-1">Documents</p>
                        <p className="text-2xl font-bold text-white">{selectedUser.documentCount}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] cursor-default">
                        <p className="text-blue-100 text-xs font-medium mb-1">Queries</p>
                        <p className="text-2xl font-bold text-white">{selectedUser.queryCount}</p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] cursor-default">
                        <p className="text-blue-100 text-xs font-medium mb-1">Status</p>
                        <p className="text-lg font-semibold text-white">
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            selectedUser.role === "admin" 
                              ? "bg-red-500/30 text-red-100" 
                              : "bg-green-500/30 text-green-100"
                          }`}>
                            {selectedUser.role === "admin" ? "Administrator" : "Active User"}
                          </span>
                        </p>
                      </div>
                      <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3 border border-white/20 hover:bg-white/15 transition-all duration-200 hover:scale-[1.02] cursor-default">
                        <p className="text-blue-100 text-xs font-medium mb-1">User ID</p>
                        <p className="text-xs font-mono text-white/90 truncate">{selectedUser._id}</p>
                      </div>
                    </div>
                  </div>

                  {/* Tabs */}
                  <div className="border-b border-gray-200 bg-gray-50/50 flex-shrink-0">
                    <div className="flex space-x-1 px-6">
                      <button
                        onClick={() => setActiveTab("documents")}
                        className={`relative py-3 px-4 font-medium text-sm transition-all duration-200 ${
                          activeTab === "documents"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          <span>Documents ({userDocuments.length})</span>
                        </span>
                        {activeTab === "documents" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
                        )}
                      </button>
                      <button
                        onClick={() => setActiveTab("queries")}
                        className={`relative py-3 px-4 font-medium text-sm transition-all duration-200 ${
                          activeTab === "queries"
                            ? "text-blue-600"
                            : "text-gray-500 hover:text-gray-700"
                        }`}
                      >
                        <span className="flex items-center space-x-2">
                          <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                          </svg>
                          <span>Queries ({userQueries.length})</span>
                        </span>
                        {activeTab === "queries" && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-t-full"></span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 overflow-y-auto custom-scrollbar">
                    {loadingUserData ? (
                      <div className="flex flex-col items-center justify-center py-16 space-y-4">
                        <div className="animate-spin h-10 w-10 border-3 border-gray-200 border-t-blue-600 rounded-full"></div>
                        <p className="text-gray-500 text-sm">Loading {activeTab}...</p>
                      </div>
                    ) : activeTab === "documents" ? (
                      <div className="space-y-3">
                        {userDocuments.length === 0 ? (
                          <div className="text-center py-12">
                            <div className="h-16 w-16 text-gray-300 mx-auto mb-4">
                              <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <h3 className="text-gray-700 font-medium mb-1">No documents uploaded</h3>
                            <p className="text-gray-500 text-sm">This user hasn't uploaded any documents yet</p>
                          </div>
                        ) : (
                          userDocuments.map((doc) => (
                            <div 
                              key={doc._id} 
                              className="group bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-[1.005]"
                            >
                              <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center space-x-3 flex-1 min-w-0">
                                  <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform duration-200">
                                    <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <p className="font-medium text-gray-900 truncate text-sm group-hover:text-blue-600 transition-colors">
                                      {getDisplayFilename(doc.filename)}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                                      <span className="flex items-center space-x-1">
                                        <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                          <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span>{formatDate(doc.createdAt)}</span>
                                      </span>
                                      <span className="flex items-center space-x-1">
                                        <span className={`h-2 w-2 rounded-full ${doc.enabled ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                                        <span>{doc.enabled ? 'Enabled' : 'Disabled'}</span>
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleDocument(doc._id)}
                                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                    doc.enabled
                                      ? "bg-gradient-to-r from-red-50 to-red-100 text-red-700 hover:from-red-100 hover:to-red-200 border border-red-200"
                                      : "bg-gradient-to-r from-green-50 to-green-100 text-green-700 hover:from-green-100 hover:to-green-200 border border-green-200"
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
                          <div className="text-center py-12">
                            <div className="h-16 w-16 text-gray-300 mx-auto mb-4">
                              <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                              </svg>
                            </div>
                            <h3 className="text-gray-700 font-medium mb-1">No queries yet</h3>
                            <p className="text-gray-500 text-sm">This user hasn't made any queries yet</p>
                          </div>
                        ) : (
                          userQueries.map((query) => (
                            <div 
                              key={query.id} 
                              className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-4 border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all duration-200 hover:scale-[1.005] group"
                            >
                              <div className="mb-3">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="h-6 w-6 bg-gradient-to-r from-blue-100 to-blue-200 rounded-lg flex items-center justify-center">
                                    <svg className="h-3.5 w-3.5 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-blue-700">QUESTION</span>
                                </div>
                                <p className="text-gray-900 ml-8 text-sm bg-blue-50/50 rounded-lg p-3 group-hover:bg-blue-50 transition-colors">
                                  {query.question}
                                </p>
                              </div>
                              <div className="bg-gradient-to-r from-white to-gray-50 rounded-lg p-3 border border-gray-100">
                                <div className="flex items-center space-x-2 mb-2">
                                  <div className="h-6 w-6 bg-gradient-to-r from-purple-100 to-purple-200 rounded-lg flex items-center justify-center">
                                    <svg className="h-3.5 w-3.5 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                      <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                                    </svg>
                                  </div>
                                  <span className="text-xs font-semibold text-purple-700">ANSWER</span>
                                </div>
                                <p className="text-gray-700 text-sm ml-8">{query.answer}</p>
                              </div>
                              <div className="flex items-center justify-between mt-3 ml-8">
                                <p className="text-xs text-gray-400">{formatDate(query.createdAt)}</p>
                                <span className="text-xs text-gray-500 flex items-center space-x-1">
                                  <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <span>Query #{query.id.slice(0, 8)}</span>
                                </span>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 h-[calc(100vh-150px)] flex flex-col items-center justify-center p-8 text-center">
                  <div className="max-w-md">
                    <div className="h-20 w-20 text-gray-300 mx-auto mb-4">
                      <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                        <path d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">Select a User</h3>
                    <p className="text-gray-600 mb-6">Choose a user from the sidebar to view their documents, queries, and account details</p>
                    <div className="flex items-center justify-center space-x-3 text-sm text-gray-500">
                      <span className="flex items-center space-x-1">
                        <div className="h-2 w-2 rounded-full bg-blue-500"></div>
                        <span>Click on any user card</span>
                      </span>
                      <span>•</span>
                      <span className="flex items-center space-x-1">
                        <div className="h-2 w-2 rounded-full bg-green-500"></div>
                        <span>View documents & queries</span>
                      </span>
                    </div>
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
          height: 6px;
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
        
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: #c1c1c1 #f1f1f1;
        }
        
        .flex-card {
          display: flex;
          flex-direction: column;
        }
      `}</style>
    </>
  );
}