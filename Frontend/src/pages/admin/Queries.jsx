import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminQueries() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadQueries = async () => {
      try {
        const res = await adminAPI.queries();
        setQueries(res.data.data?.queries);
      } catch (err) {
        console.error("Failed to load queries");
      } finally {
        setLoading(false);
      }
    };

    loadQueries();
  }, []);

  const filteredQueries = queries.filter(
    (q) =>
      q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
      q.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now - date) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return date.toLocaleDateString("en-IN", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 right-0 w-full h-96 bg-purple-900/10 blur-[120px] pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
              <div>
                <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">User Queries</h1>
                <p className="text-sm text-slate-400 font-medium flex items-center space-x-2">
                  {/* <svg className="h-4 w-4 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg> */}
                  <span>Monitor global Q&A activity across the platform</span>
                </p>
              </div>
              
              <div className="px-4 py-3 bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl flex items-center space-x-3">
                
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Total Queries</p>
                  <p className="text-xl font-bold text-center text-white">{queries.length}</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-slate-900/50 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-lg">
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-slate-500 group-focus-within:text-purple-400 transition-colors" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search queries by question, answer, or user email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 text-sm bg-slate-950/50 border border-white/5 rounded-xl focus:ring-1 focus:ring-purple-500 focus:border-purple-500/50 text-slate-200 placeholder-slate-500 transition-all duration-200 shadow-inner"
                />
              </div>
            </div>
          </div>

          {/* Queries List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-xl border border-white/5">
              <div className="relative">
                <div className="h-12 w-12 border-4 border-slate-800 border-t-purple-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Loading activity log...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredQueries.length === 0 ? (
                <div className="bg-slate-900/30 backdrop-blur-xl rounded-xl border border-white/5 p-16 text-center">
                  <div className="h-16 w-16 bg-white/5 rounded-xl flex items-center justify-center mx-auto mb-4 border border-white/5 shadow-xl">
                    <svg className="h-8 w-8 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" viewBox="0 0 24 24" stroke="currentColor">
                      <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <h3 className="text-white font-bold text-lg mb-2">No queries found</h3>
                  <p className="text-slate-400 text-sm">We couldn't find any matches for "{searchTerm}"</p>
                </div>
              ) : (
                filteredQueries.map((q, index) => (
                  <div
                    key={index}
                    className="bg-slate-900/40 backdrop-blur-xl rounded-xl border border-white/5 hover:border-purple-500/30 hover:bg-white/[0.02] hover:shadow-[0_0_30px_rgba(168,85,247,0.1)] transition-all duration-300 group overflow-hidden"
                  >
                    {/* Card Header */}
                    <div className="px-6 py-4 bg-white/[0.02] border-b border-white/5 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-9 w-9 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center text-white text-xs font-bold shadow-lg shadow-purple-500/20">
                          {q.userEmail.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-purple-300 transition-colors">{q.userEmail}</p>
                          <div className="flex items-center space-x-2 mt-0.5">
                            <span className="flex items-center text-[10px] text-slate-400 font-medium uppercase tracking-wide">
                              <svg className="h-3 w-3 mr-1 text-slate-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {formatDate(q.createdAt)}
                            </span>
                          </div>
                        </div>
                      </div>
                      <span className="text-[10px] font-mono text-slate-600 font-bold px-2 py-1 bg-white/5 rounded-md border border-white/5">
                        ID: {index + 1}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="p-6 grid gap-6">
                      {/* Question */}
                      <div className="flex gap-4">
                        <div className="h-8 w-8 bg-blue-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-blue-500/20 mt-1">
                          <svg className="h-4 w-4 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-2">Question</p>
                          <p className="text-sm text-slate-200 leading-relaxed font-medium bg-white/5 p-3 rounded-xl border border-white/5">
                            {q.question}
                          </p>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="flex gap-4">
                        <div className="h-8 w-8 bg-purple-500/10 rounded-xl flex items-center justify-center flex-shrink-0 border border-purple-500/20 mt-1">
                          <svg className="h-4 w-4 text-purple-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                        </div>
                        <div className="flex-1">
                          <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mb-2">AI Response</p>
                          <p className="text-sm text-slate-300 leading-relaxed border-l-2 border-purple-500/30 pl-4 py-1">
                            {q.answer}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </>
  );
}