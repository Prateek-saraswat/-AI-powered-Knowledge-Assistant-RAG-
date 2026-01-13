import Navbar from "../../components/Navbar";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { adminAPI } from "../../services/api.js";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalDocuments: 0,
    activeDocuments: 0,
    totalQueries: 0,
    queriesToday: 0,
    totalTokens: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await adminAPI.stats();
        setStats(res.data.stats);
      } catch (err) {
        console.error("Failed to load stats:", err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + "M";
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num.toString();
  };

  const dashboardCards = [
    {
      to: "/admin/users",
      title: "Users",
      description: "View all users and their activity",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
      bgColor: "bg-emerald-50",
      stats: loading ? "..." : `${stats.totalUsers} Users`,
    },
    {
      to: "/admin/documents",
      title: "Documents",
      description: "View & enable/disable user documents",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      bgColor: "bg-blue-50",
      stats: loading ? "..." : `${stats.activeDocuments} Active`,
    },
    {
      to: "/admin/queries",
      title: "User Queries",
      description: "Monitor all user questions & answers",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      bgColor: "bg-purple-50",
      stats: loading ? "..." : `${stats.queriesToday} Today`,
    },
    {
      to: "/admin/usage",
      title: "Usage Analytics",
      description: "Track token usage per user",
      icon: (
        <svg
          className="h-8 w-8"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-green-500 to-emerald-600",
      bgColor: "bg-green-50",
      stats: loading ? "..." : `${formatNumber(stats.totalTokens)} Tokens`,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8 animate-fadeIn">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-2">
                  Admin Dashboard
                </h1>
                <p className="text-gray-600 flex items-center space-x-2">
                  <svg
                    className="h-5 w-5"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Last updated: {new Date().toLocaleString()}</span>
                </p>
              </div>
              <div className="hidden sm:flex items-center space-x-2">
                <div className="h-3 w-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-gray-600">System Online</span>
              </div>
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Total Users</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : stats.totalUsers}
                  </p>
                  <p className="text-xs text-green-600 mt-1 flex items-center">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    Active
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Active Documents</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : stats.activeDocuments}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">Out of {loading ? "..." : stats.totalDocuments} total</p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transform hover:scale-105 transition-all duration-300 animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 mb-1">Queries Today</p>
                  <p className="text-3xl font-bold text-gray-900">
                    {loading ? "..." : stats.queriesToday}
                  </p>
                  <p className="text-xs text-blue-600 mt-1 flex items-center">
                    <svg className="h-3 w-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                    Live updates
                  </p>
                </div>
                <div className="h-14 w-14 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg">
                  <svg className="h-8 w-8 text-white" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          {/* Main Navigation Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {dashboardCards.map((card, index) => (
              <Link
                key={index}
                to={card.to}
                className="group relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-gray-100 transform hover:-translate-y-2 animate-slideUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-32 h-32 ${card.bgColor} rounded-full -mr-16 -mt-16 opacity-50 group-hover:scale-150 transition-transform duration-500`}></div>
                
                {/* Content */}
                <div className="relative p-6">
                  {/* Icon */}
                  <div className={`h-16 w-16 bg-gradient-to-br ${card.gradient} rounded-xl flex items-center justify-center text-white shadow-lg mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                    {card.icon}
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-gray-600 mb-4 leading-relaxed">
                    {card.description}
                  </p>

                  {/* Stats & Arrow */}
                  <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-gray-500">
                      {card.stats}
                    </span>
                    <div className="h-8 w-8 bg-gray-100 rounded-lg flex items-center justify-center group-hover:bg-gradient-to-br group-hover:from-blue-500 group-hover:to-indigo-600 transition-all duration-300">
                      <svg
                        className="h-5 w-5 text-gray-600 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300"
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Hover Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-blue-500 opacity-0 group-hover:opacity-5 transition-opacity duration-300 pointer-events-none"></div>
              </Link>
            ))}
          </div>
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
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .animate-fadeIn {
          animation: fadeIn 0.6s ease-out forwards;
        }

        .animate-slideUp {
          animation: slideUp 0.5s ease-out forwards;
        }
      `}</style>
    </>
  );
}