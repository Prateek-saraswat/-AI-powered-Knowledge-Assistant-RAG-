import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminUsage() {
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("tokens"); 

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const res = await adminAPI.usage();
        console.log( res.data); 
        setUsage(res.data.usage || []);
      } catch (err) {
        console.error("Failed to load usage:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUsage();
  }, []);

  const sortedUsage = [...usage].sort((a, b) => {
    if (sortBy === "tokens") {
      return b.tokens - a.tokens;
    } else {
      return (a.userEmail || "").localeCompare(b.userEmail || "");
    }
  });

  const totalTokens = usage.reduce((sum, u) => sum + (u.tokens || 0), 0);
  const avgTokens = usage.length > 0 ? Math.round(totalTokens / usage.length) : 0;
  const maxTokens = usage.length > 0 ? Math.max(...usage.map((u) => u.tokens || 0)) : 0;

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-8">
        {/* Ambient Glows */}
        <div className="absolute bottom-0 left-0 w-full h-96 bg-amber-900/10 blur-[120px] pointer-events-none"></div>

        <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
          
          {/* Header */}
          <div className="mb-10 animate-fadeIn">
            <h1 className="text-3xl font-extrabold text-white tracking-tight mb-2">Token Analytics</h1>
            <p className="text-sm text-slate-400 font-medium flex items-center space-x-2">
              <svg className="h-4 w-4 text-amber-500" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Monitor API consumption and user quotas</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Total Tokens */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300 group animate-slideUp">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Total Consumption</p>
                  <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {formatNumber(totalTokens)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded">All Users</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-blue-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Average Tokens */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-300 group animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Average Usage</p>
                  <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {formatNumber(avgTokens)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded">Per User</p>
                </div>
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Max Usage */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-white/5 p-6 hover:border-amber-500/30 transition-all duration-300 group animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">Peak Usage</p>
                  <p className="text-3xl font-black text-white group-hover:text-amber-400 transition-colors">
                    {formatNumber(maxTokens)}
                  </p>
                  <p className="text-[10px] text-slate-400 mt-2 font-medium bg-white/5 inline-block px-2 py-0.5 rounded">Single Account</p>
                </div>
                <div className="h-12 w-12 bg-amber-500/10 rounded-2xl flex items-center justify-center border border-amber-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-amber-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="flex items-center justify-end mb-6 animate-fadeIn">
            <div className="bg-slate-900/50 backdrop-blur-md rounded-xl p-1.5 border border-white/10 flex space-x-1">
              <button
                onClick={() => setSortBy("tokens")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  sortBy === "tokens"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Sort by Tokens
              </button>
              <button
                onClick={() => setSortBy("user")}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all duration-200 ${
                  sortBy === "user"
                    ? "bg-amber-500 text-white shadow-lg shadow-amber-500/20"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Sort by User
              </button>
            </div>
          </div>

          {/* Usage Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900/30 backdrop-blur-sm rounded-2xl border border-white/5">
              <div className="relative">
                <div className="h-12 w-12 border-4 border-slate-800 border-t-amber-500 rounded-full animate-spin"></div>
              </div>
              <p className="mt-4 text-slate-400 text-sm font-medium animate-pulse">Calculating metrics...</p>
            </div>
          ) : (
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-2xl shadow-xl border border-white/5 overflow-hidden animate-slideUp">
              <div className="overflow-x-auto custom-scrollbar">
                <table className="w-full">
                  <thead className="bg-white/[0.02] border-b border-white/5">
                    <tr>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Rank</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">User Account</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Tokens</th>
                      <th className="px-6 py-4 text-left text-[10px] font-bold text-slate-400 uppercase tracking-widest w-1/3">Consumption Level</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {sortedUsage.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-16 text-center">
                          <div className="h-16 w-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/5">
                            <svg className="h-8 w-8 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                            </svg>
                          </div>
                          <p className="text-slate-400 font-medium text-sm">No usage data recorded</p>
                        </td>
                      </tr>
                    ) : (
                      sortedUsage.map((u, index) => {
                        const percentage = maxTokens > 0 ? (u.tokens / maxTokens) * 100 : 0;
                        return (
                          <tr
                            key={u.userId || index}
                            className="group hover:bg-white/[0.02] transition-colors duration-200"
                          >
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className={`h-8 w-8 rounded-lg flex items-center justify-center font-bold text-xs shadow-lg transition-transform group-hover:scale-110 ${
                                index === 0 ? "bg-gradient-to-br from-amber-400 to-yellow-600 text-white" :
                                index === 1 ? "bg-gradient-to-br from-slate-400 to-slate-600 text-white" :
                                index === 2 ? "bg-gradient-to-br from-orange-400 to-orange-600 text-white" :
                                "bg-slate-800 text-slate-400 border border-white/10"
                              }`}>
                                #{index + 1}
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-3">
                                <div className="h-8 w-8 bg-gradient-to-br from-indigo-500 to-violet-600 rounded-lg flex items-center justify-center text-white text-[10px] font-bold shadow-md">
                                  {(u.userEmail || "??").slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-sm font-bold text-slate-200 group-hover:text-white transition-colors">{u.userEmail || "Unknown User"}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-bold text-white font-mono tracking-tight">{formatNumber(u.tokens)}</span>
                                <span className="text-[10px] text-slate-500 font-medium uppercase">tkns</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 align-middle">
                              <div className="w-full max-w-xs">
                                <div className="flex items-center justify-between mb-1.5">
                                  <span className="text-[10px] font-bold text-slate-500">{percentage.toFixed(1)}% of top user</span>
                                </div>
                                <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden border border-white/5">
                                  <div
                                    className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_10px_rgba(245,158,11,0.5)] transition-all duration-500 ease-out"
                                    style={{ width: `${percentage}%` }}
                                  ></div>
                                </div>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
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
          background: rgba(245, 158, 11, 0.5);
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </>
  );
}