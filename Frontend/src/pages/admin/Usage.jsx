import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { adminAPI } from "../../services/api";

export default function AdminUsage() {
  const [usage, setUsage] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("tokens"); // 'tokens' or 'user'

  useEffect(() => {
    const loadUsage = async () => {
      try {
        const res = await adminAPI.usage();
        console.log("Usage data:", res.data); // Debug log
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
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-green-50 to-emerald-50 py-6">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          {/* Header */}
          <div className="mb-6 animate-fadeIn">
            <h1 className="text-2xl font-bold text-gray-900 mb-1">Token Usage Analytics</h1>
            <p className="text-gray-600 flex items-center space-x-2 text-sm">
              <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
              <span>Track token usage per user</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Total Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(totalTokens)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">All users combined</p>
                </div>
                <div className="h-11 w-11 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Average Tokens</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(avgTokens)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Per user</p>
                </div>
                <div className="h-11 w-11 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-4 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-gray-600 mb-1">Highest Usage</p>
                  <p className="text-2xl font-bold text-gray-900">{formatNumber(maxTokens)}</p>
                  <p className="text-xs text-gray-500 mt-0.5">Single user</p>
                </div>
                <div className="h-11 w-11 bg-gradient-to-br from-orange-500 to-red-600 rounded-lg flex items-center justify-center shadow-lg">
                  <svg className="h-6 w-6 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Sort Controls */}
          <div className="bg-white rounded-lg shadow-md p-3 border border-gray-100 mb-4 animate-fadeIn">
            <div className="flex items-center justify-between">
              <p className="text-xs font-medium text-gray-700">Sort by:</p>
              <div className="flex space-x-2">
                <button
                  onClick={() => setSortBy("tokens")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                    sortBy === "tokens"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  Tokens
                </button>
                <button
                  onClick={() => setSortBy("user")}
                  className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-all duration-200 ${
                    sortBy === "user"
                      ? "bg-green-600 text-white shadow-lg"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                >
                  User (A-Z)
                </button>
              </div>
            </div>
          </div>

          {/* Usage Table */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-md">
              <div className="relative">
                <div className="h-12 w-12 rounded-full border-4 border-gray-200"></div>
                <div className="absolute top-0 left-0 h-12 w-12 rounded-full border-4 border-t-green-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
              </div>
              <p className="mt-3 text-gray-600 font-medium text-sm">Loading usage data...</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-100 animate-slideUp">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Total Tokens
                      </th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                        Usage
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {sortedUsage.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-4 py-12 text-center">
                          <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                            <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                          <p className="text-gray-600 font-medium text-sm">No usage data available</p>
                          <p className="text-gray-400 text-xs mt-1">Data will appear once users start using the system</p>
                        </td>
                      </tr>
                    ) : (
                      sortedUsage.map((u, index) => {
                        const percentage = maxTokens > 0 ? (u.tokens / maxTokens) * 100 : 0;
                        return (
                          <tr
                            key={u.userId || index}
                            className="hover:bg-green-50 transition-colors duration-200 animate-slideUp"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center">
                                {sortBy === "tokens" && (
                                  <div
                                    className={`h-7 w-7 rounded-lg flex items-center justify-center font-bold text-white text-xs ${
                                      index === 0
                                        ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                        : index === 1
                                        ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                        : index === 2
                                        ? "bg-gradient-to-br from-orange-400 to-orange-600"
                                        : "bg-gradient-to-br from-blue-500 to-indigo-600"
                                    }`}
                                  >
                                    #{index + 1}
                                  </div>
                                )}
                                {sortBy === "user" && (
                                  <div className="h-7 w-7 rounded-lg flex items-center justify-center font-bold text-white text-xs bg-gradient-to-br from-blue-500 to-indigo-600">
                                    #{index + 1}
                                  </div>
                                )}
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-2">
                                <div className="h-8 w-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-lg flex items-center justify-center text-white text-xs font-bold shadow-md">
                                  {(u.userEmail || "??").slice(0, 2).toUpperCase()}
                                </div>
                                <span className="text-sm font-medium text-gray-900">{u.userEmail || "Unknown"}</span>
                              </div>
                            </td>
                            <td className="px-4 py-3 whitespace-nowrap">
                              <div className="flex items-center space-x-1.5">
                                <span className="text-base font-bold text-gray-900">{formatNumber(u.tokens)}</span>
                                <span className="text-xs text-gray-500">tokens</span>
                              </div>
                            </td>
                            <td className="px-4 py-3">
                              <div className="w-full">
                                <div className="flex items-center justify-between mb-1">
                                  <span className="text-xs text-gray-600">{percentage.toFixed(1)}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                                  <div
                                    className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 rounded-full transition-all duration-500"
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
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}