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
        <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ),
      gradient: "from-emerald-500 to-teal-600",
      iconBg: "bg-emerald-500/10",
      iconColor: "text-emerald-400",
      glow: "shadow-emerald-500/20",
      borderHover: "hover:border-emerald-500/50",
      stats: loading ? "..." : `${stats.totalUsers} Users`,
    },
    {
      to: "/admin/documents",
      title: "Documents",
      description: "View & enable/disable user documents",
      icon: (
        <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      ),
      gradient: "from-blue-500 to-indigo-600",
      iconBg: "bg-blue-500/10",
      iconColor: "text-blue-400",
      glow: "shadow-blue-500/20",
      borderHover: "hover:border-blue-500/50",
      stats: loading ? "..." : `${stats.activeDocuments} Active`,
    },
    {
      to: "/admin/queries",
      title: "User Queries",
      description: "Monitor all user questions & answers",
      icon: (
        <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
        </svg>
      ),
      gradient: "from-purple-500 to-pink-600",
      iconBg: "bg-purple-500/10",
      iconColor: "text-purple-400",
      glow: "shadow-purple-500/20",
      borderHover: "hover:border-purple-500/50",
      stats: loading ? "..." : `${stats.queriesToday} Today`,
    },
    {
      to: "/admin/usage",
      title: "Usage Analytics",
      description: "Track token usage per user",
      icon: (
        <svg className="h-8 w-8" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      gradient: "from-amber-500 to-orange-600",
      iconBg: "bg-amber-500/10",
      iconColor: "text-amber-400",
      glow: "shadow-amber-500/20",
      borderHover: "hover:border-amber-500/50",
      stats: loading ? "..." : `${formatNumber(stats.totalTokens)} Tokens`,
    },
  ];

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-[#020617] relative overflow-hidden py-8">
        {/* Ambient Glows */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[120px] pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          
          {/* Header Section */}
          <div className="mb-10 animate-fadeIn">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-2">
                  Admin <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">Dashboard</span>
                </h1>
                <p className="text-slate-400 flex items-center space-x-2 text-sm font-medium">
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>System Overview • Updated {new Date().toLocaleTimeString()}</span>
                </p>
              </div>
            
            </div>
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10">
            {/* Total Users Stat */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/5 p-6 hover:border-emerald-500/30 transition-all duration-300 group animate-slideUp">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Total Users</p>
                  <p className="text-3xl font-black text-white group-hover:text-emerald-400 transition-colors">
                    {loading ? "..." : stats.totalUsers}
                  </p>
                  <p className="text-xs text-emerald-400 mt-2 flex items-center font-bold">
                    <svg className="h-3 w-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z" clipRule="evenodd" />
                    </svg>
                    +12% vs last week
                  </p>
                </div>
                <div className="h-12 w-12 bg-emerald-500/10 rounded-2xl flex items-center justify-center border border-emerald-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>
                </div>
              </div>
            </div>

            {/* Active Docs Stat */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/5 p-6 hover:border-blue-500/30 transition-all duration-300 group animate-slideUp" style={{ animationDelay: "0.1s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Active Documents</p>
                  <p className="text-3xl font-black text-white group-hover:text-blue-400 transition-colors">
                    {loading ? "..." : stats.activeDocuments}
                  </p>
                  <p className="text-xs text-slate-500 mt-2 font-medium">Out of {loading ? "..." : stats.totalDocuments} total files</p>
                </div>
                <div className="h-12 w-12 bg-blue-500/10 rounded-2xl flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                </div>
              </div>
            </div>

            {/* Queries Today Stat */}
            <div className="bg-slate-900/50 backdrop-blur-xl rounded-3xl shadow-xl border border-white/5 p-6 hover:border-purple-500/30 transition-all duration-300 group animate-slideUp" style={{ animationDelay: "0.2s" }}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Queries Today</p>
                  <p className="text-3xl font-black text-white group-hover:text-purple-400 transition-colors">
                    {loading ? "..." : stats.queriesToday}
                  </p>
                  <p className="text-xs text-purple-400 mt-2 flex items-center font-bold">
                    <svg className="h-3 w-3 mr-1 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                      <circle cx="10" cy="10" r="8" />
                    </svg>
                    Live Traffic
                  </p>
                </div>
                <div className="h-12 w-12 bg-purple-500/10 rounded-2xl flex items-center justify-center border border-purple-500/20 group-hover:scale-110 transition-transform duration-300">
                  <svg className="h-6 w-6 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" /></svg>
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
                className={`group relative bg-slate-900/40 backdrop-blur-xl rounded-3xl shadow-lg border border-white/5 overflow-hidden transform hover:-translate-y-2 transition-all duration-300 animate-slideUp ${card.borderHover}`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                {/* Background Pattern */}
                <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-br ${card.gradient} rounded-full -mr-16 -mt-16 opacity-10 blur-2xl group-hover:opacity-20 group-hover:scale-150 transition-all duration-500`}></div>
                
                <div className="relative p-6">
                  {/* Icon */}
                  <div className={`h-14 w-14 ${card.iconBg} rounded-2xl flex items-center justify-center mb-5 ${card.glow} border border-white/5 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300`}>
                    <div className={card.iconColor}>
                      {card.icon}
                    </div>
                  </div>

                  {/* Title */}
                  <h2 className="text-xl font-bold text-white mb-2 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-slate-400 transition-all duration-300">
                    {card.title}
                  </h2>

                  {/* Description */}
                  <p className="text-sm text-slate-400 mb-6 leading-relaxed font-medium">
                    {card.description}
                  </p>

                  {/* Stats & Arrow */}
                  <div className="flex items-center justify-between mt-auto pt-4 border-t border-white/5">
                    <span className="text-xs font-bold text-slate-300 bg-white/5 px-2 py-1 rounded-lg">
                      {card.stats}
                    </span>
                    <div className="h-8 w-8 bg-white/5 rounded-full flex items-center justify-center group-hover:bg-white/10 transition-colors duration-300">
                      <svg
                        className="h-4 w-4 text-slate-400 group-hover:text-white transform group-hover:translate-x-1 transition-all duration-300"
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
              </Link>
            ))}
          </div>
        </div>
      </div>

      <style jsx>{`
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