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
      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-0 w-full h-96 bg-blue-900/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Document Management</h1>
                <p className="text-sm text-slate-400 font-medium flex items-center space-x-2">
                  <svg className="h-4 w-4 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <span>Monitor and manage global document access</span>
                </p>
              </div>
              <button
                onClick={loadDocuments}
                className="group flex items-center space-x-2 px-4 py-2.5 bg-slate-800 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-slate-700 hover:border-white/20 transition-all duration-200 shadow-lg active:scale-95"
              >
                <svg className="h-4 w-4 group-hover:rotate-180 transition-transform duration-500 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                  <path d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                <span>Refresh Data</span>
              </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Total Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-5 hover:border-blue-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Uploads</p>
                    <p className="text-2xl font-black text-white group-hover:text-blue-400 transition-colors">{stats.total}</p>
                  </div>
                  <div className="h-10 w-10 bg-blue-500/10 rounded-xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-blue-500 h-1 rounded-full" style={{ width: '100%' }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">System wide capacity</p>
              </div>

              {/* Enabled Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-5 hover:border-emerald-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Active</p>
                    <p className="text-2xl font-black text-white group-hover:text-emerald-400 transition-colors">{stats.enabled}</p>
                  </div>
                  <div className="h-10 w-10 bg-emerald-500/10 rounded-xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-emerald-500 h-1 rounded-full" style={{ width: `${(stats.enabled / stats.total) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">{((stats.enabled / stats.total) * 100 || 0).toFixed(0)}% availability rate</p>
              </div>

              {/* Disabled Card */}
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 p-5 hover:border-rose-500/30 transition-all duration-300 group">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Disabled</p>
                    <p className="text-2xl font-black text-white group-hover:text-rose-400 transition-colors">{stats.disabled}</p>
                  </div>
                  <div className="h-10 w-10 bg-rose-500/10 rounded-xl flex items-center justify-center border border-rose-500/20 group-hover:scale-110 transition-transform">
                    <svg className="h-5 w-5 text-rose-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M13.477 14.89A6 6 0 015.11 6.524l8.367 8.368zm1.414-1.414L6.524 5.11a6 6 0 018.367 8.367z" clipRule="evenodd" />
                    </svg>
                  </div>
                </div>
                <div className="w-full bg-slate-800 rounded-full h-1 overflow-hidden">
                  <div className="bg-rose-500 h-1 rounded-full" style={{ width: `${(stats.disabled / stats.total) * 100}%` }}></div>
                </div>
                <p className="text-[10px] text-slate-400 mt-2 font-medium">Restricted access</p>
              </div>
            </div>

            {/* Filter Bar */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-lg border border-white/5 p-4 mb-6">
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-4 w-4 text-slate-500 group-focus-within:text-blue-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search documents by filename or user email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950/50 border border-white/10 rounded-xl focus:ring-1 focus:ring-blue-500 focus:border-blue-500/50 text-slate-200 placeholder-slate-500 transition-all duration-200"
                  />
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

                <div className="flex space-x-2 bg-slate-950/50 p-1 rounded-xl border border-white/10">
                  {['all', 'enabled', 'disabled'].map((status) => (
                    <button
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all duration-200 ${
                        filterStatus === status
                          ? status === 'enabled' ? "bg-emerald-500 text-white shadow-lg shadow-emerald-500/20"
                          : status === 'disabled' ? "bg-rose-500 text-white shadow-lg shadow-rose-500/20"
                          : "bg-blue-500 text-white shadow-lg shadow-blue-500/20"
                          : "text-slate-400 hover:text-white hover:bg-white/5"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Documents Table/Grid */}
            {loading ? (
              <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-white/5">
                <div className="relative">
                  <div className="h-12 w-12 border-4 border-slate-700 border-t-blue-500 rounded-full animate-spin"></div>
                </div>
                <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Fetching documents...</p>
              </div>
            ) : (
              <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 overflow-hidden">
                {/* Desktop Table */}
                <div className="hidden lg:block">
                  <div className="overflow-x-auto custom-scrollbar">
                    <table className="w-full">
                      <thead className="bg-white/[0.02] border-b border-white/5">
                        <tr>
                          {["Document", "User", "Status", "Action"].map((header) => (
                            <th key={header} className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                              {header}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {filteredDocuments.map((doc) => (
                          <tr
                            key={doc._id}
                            className="group hover:bg-white/[0.02] transition-colors duration-200"
                            onMouseEnter={() => setHoveredDoc(doc._id)}
                            onMouseLeave={() => setHoveredDoc(null)}
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-4">
                                <div className={`h-10 w-10 rounded-xl flex items-center justify-center transition-all duration-300 border border-white/10 ${
                                  hoveredDoc === doc._id 
                                    ? "bg-blue-500/20 border-blue-500/40 scale-110" 
                                    : "bg-slate-800"
                                }`}>
                                  <svg className={`h-5 w-5 transition-colors ${hoveredDoc === doc._id ? 'text-blue-400' : 'text-slate-400'}`} fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                    <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                </div>
                                <div>
                                <p
  className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors 
             truncate max-w-[220px]"
  title={getDisplayFilename(doc.filename)}
>
  {getDisplayFilename(doc.filename)}
</p>
                                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{formatDate(doc.createdAt)}</p>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-lg">
                                  {doc.userEmail.slice(0, 2).toUpperCase()}
                                </div>
                                <p className="text-sm text-slate-300 font-medium">{doc.userEmail}</p>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide border ${
                                doc.enabled 
                                  ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" 
                                  : "bg-rose-500/10 text-rose-400 border-rose-500/20"
                              }`}>
                                <span className={`h-1.5 w-1.5 rounded-full mr-2 ${doc.enabled ? 'bg-emerald-500 animate-pulse' : 'bg-rose-500'}`}></span>
                                {doc.enabled ? "Enabled" : "Disabled"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <button
                                onClick={() => toggleDocument(doc._id)}
                                className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                                  doc.enabled
                                    ? "bg-rose-500/10 text-rose-400 border-rose-500/20 hover:bg-rose-500/20 hover:border-rose-500/40"
                                    : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500/20 hover:border-emerald-500/40"
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
                  <div className="grid grid-cols-1 gap-4 p-4">
                    {filteredDocuments.map((doc) => (
                      <div
                        key={doc._id}
                        className="bg-white/[0.02] border border-white/5 rounded-xl p-4 hover:border-blue-500/30 transition-all duration-200"
                      >
                        <div className="flex justify-between items-start mb-3">
                          <div className="flex items-center space-x-3">
                            <div className="h-10 w-10 bg-slate-800 rounded-lg flex items-center justify-center border border-white/10">
                              <svg className="h-5 w-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-bold text-white text-sm">{getDisplayFilename(doc.filename)}</p>
                              <p className="text-xs text-slate-500 mt-0.5">{formatDate(doc.createdAt)}</p>
                            </div>
                          </div>
                          <span className={`h-2 w-2 rounded-full ${doc.enabled ? 'bg-emerald-500' : 'bg-rose-500'}`}></span>
                        </div>
                        
                        <div className="flex items-center space-x-2 mb-4 bg-white/5 p-2 rounded-lg">
                          <div className="h-5 w-5 bg-indigo-500/20 rounded flex items-center justify-center text-[10px] text-indigo-300 font-bold">
                            {doc.userEmail.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-xs text-slate-300 font-mono">{doc.userEmail}</p>
                        </div>
                        
                        <div className="flex justify-end">
                          <button
                            onClick={() => toggleDocument(doc._id)}
                            className={`w-full py-2 rounded-lg text-xs font-bold uppercase tracking-wider border ${
                              doc.enabled
                                ? "bg-rose-500/10 text-rose-400 border-rose-500/20"
                                : "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                            }`}
                          >
                            {doc.enabled ? "Disable Document" : "Enable Document"}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Empty State */}
                {filteredDocuments.length === 0 && (
                  <div className="text-center py-20">
                    <div className="h-20 w-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                      <svg className="h-10 w-10 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <h3 className="text-lg font-bold text-white mb-2">No documents found</h3>
                    <p className="text-slate-400 text-sm max-w-xs mx-auto">
                      {searchTerm || filterStatus !== "all" 
                        ? "Try adjusting your search terms or filters."
                        : "No documents have been uploaded yet."}
                    </p>
                    {(searchTerm || filterStatus !== "all") && (
                      <button
                        onClick={() => {
                          setSearchTerm("");
                          setFilterStatus("all");
                        }}
                        className="mt-6 px-6 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-xs font-bold uppercase tracking-wider rounded-lg transition-all"
                      >
                        Clear Filters
                      </button>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <style >{`
        .custom-scrollbar::-webkit-scrollbar {
          height: 6px;
          width: 6px;
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
      `}</style>
    </>
  );
}