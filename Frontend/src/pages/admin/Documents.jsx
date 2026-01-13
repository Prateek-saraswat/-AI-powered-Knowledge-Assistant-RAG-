import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminDocuments() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [hoveredDoc, setHoveredDoc] = useState(null);

  // Helper to clean filename (remove UUID prefix)
  const getDisplayFilename = (filename) => {
    if (!filename) return "Untitled";
    
    const parts = filename.split("_");
    if (parts.length > 1 && parts[0].match(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i)) {
      return parts.slice(1).join("_");
    }
    
    return filename;
  };

  const loadDocuments = async () => {
    setLoading(true);
    try {
      const res = await adminAPI.documents();
      setDocuments(res.data.documents);
    } catch (err) {
      console.error("Failed to load documents");
    } finally {
      setLoading(false);
    }
  };

  const toggleDocument = async (id) => {
    try {
      await adminAPI.toggleDocument(id);
      loadDocuments();
    } catch (err) {
      alert("Failed to toggle document");
    }
  };

  useEffect(() => {
    loadDocuments();
  }, []);

  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.userEmail.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterStatus === "all" ||
      (filterStatus === "enabled" && doc.enabled) ||
      (filterStatus === "disabled" && !doc.enabled);
    return matchesSearch && matchesFilter;
  });

  const stats = {
    total: documents.length,
    enabled: documents.filter((d) => d.enabled).length,
    disabled: documents.filter((d) => !d.enabled).length,
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <div className="mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
              <div className="mb-4 sm:mb-0">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">Document Management</h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <svg className="h-5 w-5 text-blue-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Monitor and manage all user documents in the system</span>
                </p>
              </div>
              <button
                onClick={loadDocuments}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 hover:shadow-lg hover:scale-[1.02] active:scale-95 shadow-md"
              >
                <svg className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Documents</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Total Documents</p>
                    <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
                    <p className="text-xs text-gray-500 mt-1">Across all users</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="flex-1">
                      <span className="inline-flex items-center">
                        <div className="h-2 w-2 rounded-full bg-green-500 mr-1.5"></div>
                        <span>{((stats.enabled / stats.total) * 100 || 0).toFixed(0)}% enabled</span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Enabled</p>
                    <p className="text-2xl font-bold text-green-600">{stats.enabled}</p>
                    <p className="text-xs text-gray-500 mt-1">Available for queries</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-green-600">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    <span>Active and searchable</span>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wider mb-1">Disabled</p>
                    <p className="text-2xl font-bold text-red-600">{stats.disabled}</p>
                    <p className="text-xs text-gray-500 mt-1">Hidden from queries</p>
                  </div>
                  <div className="h-12 w-12 bg-gradient-to-br from-red-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg">
                    <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="mt-3 pt-3 border-t border-gray-100">
                  <div className="flex items-center text-xs text-red-600">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367z" clipRule="evenodd" />
                    </svg>
                    <span>Not available for search</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Search and Filter Bar */}
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                {/* Search */}
                <div className="flex-1">
                  <div className="relative group">
                    <input
                      type="text"
                      placeholder="Search documents by filename or user email..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 text-sm border border-gray-300 rounded-xl focus:ring-3 focus:ring-blue-500/30 focus:border-blue-500 transition-all duration-200 bg-gray-50/50 hover:bg-white group-hover:shadow-sm"
                    />
                    <svg className="absolute left-3.5 top-3.5 h-4 w-4 text-gray-400 group-focus-within:text-blue-500 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    {searchTerm && (
                      <button
                        onClick={() => setSearchTerm("")}
                        className="absolute right-3.5 top-3.5 h-4 w-4 text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                          <path d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Filter */}
                <div className="flex space-x-2">
                  <button
                    onClick={() => setFilterStatus("all")}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      filterStatus === "all"
                        ? "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    All ({stats.total})
                  </button>
                  <button
                    onClick={() => setFilterStatus("enabled")}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      filterStatus === "enabled"
                        ? "bg-gradient-to-r from-green-600 to-emerald-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    Enabled ({stats.enabled})
                  </button>
                  <button
                    onClick={() => setFilterStatus("disabled")}
                    className={`px-4 py-3 text-sm font-medium rounded-xl transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                      filterStatus === "disabled"
                        ? "bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-600 hover:bg-gray-200 hover:shadow-sm"
                    }`}
                  >
                    Disabled ({stats.disabled})
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Documents Grid/Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-16 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200">
              <div className="relative">
                <div className="h-16 w-16 border-4 border-gray-200 border-t-blue-600 rounded-full animate-spin"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="h-8 w-8 border-2 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
              </div>
              <p className="mt-4 text-gray-700 font-medium">Loading documents...</p>
              <p className="text-gray-500 text-sm mt-1">Please wait while we fetch all documents</p>
            </div>
          ) : (
            <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Desktop Table */}
              <div className="hidden lg:block">
                <div className="overflow-x-auto custom-scrollbar">
                  <table className="w-full">
                    <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span>Document</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <span>User</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Status</span>
                          </div>
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                          <div className="flex items-center space-x-2">
                            <svg className="h-4 w-4 text-gray-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            <span>Action</span>
                          </div>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {filteredDocuments.map((doc) => (
                        <tr
                          key={doc._id}
                          className="group hover:bg-gradient-to-r hover:from-blue-50/50 hover:to-gray-50/50 transition-all duration-200"
                          onMouseEnter={() => setHoveredDoc(doc._id)}
                          onMouseLeave={() => setHoveredDoc(null)}
                        >
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className={`h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 ${hoveredDoc === doc._id ? 'scale-110' : ''}`}>
                                <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                  <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                                  {getDisplayFilename(doc.filename)}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">{formatDate(doc.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center space-x-3">
                              <div className="h-8 w-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center text-white text-xs font-semibold shadow-md">
                                {doc.userEmail.slice(0, 2).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm text-gray-900">{doc.userEmail}</p>
                                <p className="text-xs text-gray-500">Uploaded by user</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {doc.enabled ? (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200">
                                <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-2 animate-pulse"></div>
                                <span>Enabled</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200">
                                <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-2"></div>
                                <span>Disabled</span>
                              </span>
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <button
                              onClick={() => toggleDocument(doc._id)}
                              className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                doc.enabled
                                  ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-md hover:shadow-lg"
                                  : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md hover:shadow-lg"
                              }`}
                            >
                              {doc.enabled ? "Disable" : "Enable"}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Cards */}
              <div className="lg:hidden">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                  {filteredDocuments.map((doc) => (
                    <div
                      key={doc._id}
                      className="group bg-gradient-to-br from-white to-gray-50 rounded-xl border border-gray-200 p-4 hover:shadow-xl hover:border-blue-300 transition-all duration-200 hover:-translate-y-1"
                      onMouseEnter={() => setHoveredDoc(doc._id)}
                      onMouseLeave={() => setHoveredDoc(null)}
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className={`h-10 w-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-md transition-transform duration-200 ${hoveredDoc === doc._id ? 'scale-110' : ''}`}>
                            <svg className="h-5 w-5 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          <div>
                            <p className="font-medium text-gray-900 group-hover:text-blue-600 transition-colors">
                              {getDisplayFilename(doc.filename)}
                            </p>
                            <p className="text-xs text-gray-500 mt-0.5">{formatDate(doc.createdAt)}</p>
                          </div>
                        </div>
                        <div>
                          {doc.enabled ? (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-green-100 to-green-50 text-green-800 border border-green-200">
                              <div className="h-1.5 w-1.5 rounded-full bg-green-500 mr-1.5 animate-pulse"></div>
                              <span>Enabled</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-red-100 to-red-50 text-red-800 border border-red-200">
                              <div className="h-1.5 w-1.5 rounded-full bg-red-500 mr-1.5"></div>
                              <span>Disabled</span>
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 mb-4">
                        <div className="h-6 w-6 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold shadow-sm">
                          {doc.userEmail.slice(0, 2).toUpperCase()}
                        </div>
                        <p className="text-sm text-gray-600 truncate">{doc.userEmail}</p>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">
                          <span className="flex items-center">
                            <svg className="h-3 w-3 mr-1" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span>Uploaded</span>
                          </span>
                        </div>
                        <button
                          onClick={() => toggleDocument(doc._id)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                            doc.enabled
                              ? "bg-gradient-to-r from-red-600 to-rose-600 text-white hover:from-red-700 hover:to-rose-700 shadow-md"
                              : "bg-gradient-to-r from-green-600 to-emerald-600 text-white hover:from-green-700 hover:to-emerald-700 shadow-md"
                          }`}
                        >
                          {doc.enabled ? "Disable" : "Enable"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Empty State */}
              {filteredDocuments.length === 0 && (
                <div className="text-center py-16">
                  <div className="h-20 w-20 text-gray-300 mx-auto mb-4">
                    <svg fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">No documents found</h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto">
                    {searchTerm || filterStatus !== "all" 
                      ? "Try adjusting your search terms or filters to find what you're looking for."
                      : "No documents have been uploaded to the system yet."}
                  </p>
                  {(searchTerm || filterStatus !== "all") && (
                    <button
                      onClick={() => {
                        setSearchTerm("");
                        setFilterStatus("all");
                      }}
                      className="mt-4 px-4 py-2 text-sm text-blue-600 hover:text-blue-700 font-medium hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Add custom scrollbar styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
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
      `}</style>
    </>
  );
}