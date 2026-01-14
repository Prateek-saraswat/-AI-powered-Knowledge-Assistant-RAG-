import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleNavigateHome = () => {
    navigate(user.role === "admin" ? "/admin" : "/dashboard");
  };

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
      if (isMobileMenuOpen && mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  const getInitials = (email) => {
    return email
      ? email.split("@")[0].slice(0, 2).toUpperCase()
      : "U";
  };

  const getRoleBadge = (role) => {
    if (role === "admin") {
      return (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-red-900/80 to-orange-900/80 text-red-300 border border-red-800/50 shadow-sm uppercase tracking-wider backdrop-blur-sm">
          <span className="h-2 w-2 rounded-full bg-red-500 mr-2 animate-pulse"></span>
          Admin
        </span>
      );
    }
    return (
      <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold bg-gradient-to-r from-indigo-900/80 to-blue-900/80 text-indigo-300 border border-indigo-800/50 shadow-sm uppercase tracking-wider backdrop-blur-sm">
        <span className="h-2 w-2 rounded-full bg-indigo-500 mr-2 animate-pulse"></span>
        Member
      </span>
    );
  };

  return (
    <nav className={`sticky top-0 z-50 bg-slate-900/95 backdrop-blur-2xl border-b border-slate-800 transition-all duration-500 ${
      scrolled 
        ? "shadow-2xl shadow-blue-500/20" 
        : "shadow-lg shadow-blue-500/10"
    }`}>
      
      {/* Dynamic Background Blobs */}
      <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-indigo-900/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-900/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-slate-900/30 rounded-full mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000"></div>
      </div>

      <div className="pt-2 h-[80px] max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo & Brand */}
          <div
            className="flex items-center gap-4 cursor-pointer group select-none"
            onClick={handleNavigateHome}
          >
            <div className="relative">
              <div className="absolute -inset-3 bg-gradient-to-tr from-indigo-900/40 to-blue-900/40 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative h-12 w-12 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-500/20 border border-blue-800/50 transform group-hover:scale-105 group-hover:rotate-3 transition-all duration-300">
                <svg
                  className="h-6 w-6 text-blue-300"
                  fill="none"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <div className="absolute -top-1 -right-1 h-4 w-4 bg-cyan-500 rounded-full border-2 border-slate-900 animate-pulse shadow-lg"></div>
            </div>
            
            <div className="flex flex-col justify-center">
              <h1 className="text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-300 via-indigo-300 to-cyan-300 tracking-tight group-hover:from-white group-hover:via-blue-200 group-hover:to-cyan-200 transition-all duration-300">
                Document Chat
              </h1>
              <p className="text-xs text-slate-400 font-medium tracking-wide group-hover:text-blue-400 transition-colors">
                Intelligent Document Assistant
              </p>
            </div>
          </div>

          {/* Desktop Right Section */}
          <div className="hidden md:flex items-center gap-8">
            
            {/* User Details */}
            <div className="flex flex-col items-end">
              <p className="text-sm font-bold text-slate-200">{user.email}</p>
              <div className="mt-1.5">{getRoleBadge(user.role)}</div>
            </div>

            {/* Profile Dropdown Trigger */}
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                className={`relative h-12 w-12 rounded-full transition-all duration-300 focus:outline-none ${
                  isDropdownOpen 
                    ? "ring-4 ring-blue-900/50 scale-110 shadow-xl" 
                    : "hover:scale-110 hover:ring-4 hover:ring-blue-900/50 hover:shadow-lg"
                }`}
              >
                {/* Gradient Ring */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-700 via-blue-800 to-slate-900 rounded-full"></div>
                
                {/* Image Container */}
                <div className="relative h-full w-full bg-slate-800 rounded-full flex items-center justify-center border-3 border-slate-700 transform hover:rotate-6 transition-transform duration-300">
                  <span className="font-black text-transparent bg-clip-text bg-gradient-to-br from-blue-300 to-cyan-300 text-base">
                    {getInitials(user.email)}
                  </span>
                </div>

                {/* Online Status Indicator */}
                <div className="absolute -bottom-0.5 -right-0.5 h-3.5 w-3.5 bg-cyan-500 rounded-full border-2 border-slate-900 shadow-sm"></div>
              </button>

              {/* Dropdown Menu */}
              {isDropdownOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl shadow-blue-500/20 py-2 z-50 animate-slideDown origin-top-right">
                  
                  {/* Menu Header */}
                  <div className="px-5 py-4 border-b border-slate-800/50 bg-gradient-to-br from-slate-900/50 to-blue-900/30">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 rounded-xl flex items-center justify-center font-black text-blue-300 text-lg shadow-lg">
                        {getInitials(user.email)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-200 truncate">
                          {user.email}
                        </p>
                        <div className="mt-1.5">{getRoleBadge(user.role)}</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button
                      onClick={handleNavigateHome}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-medium text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-indigo-900/20 rounded-xl transition-all duration-200 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-blue-900/30 to-slate-800 flex items-center justify-center group-hover:from-blue-800/40 group-hover:to-slate-700 text-blue-400 group-hover:text-blue-300 transition-all shadow-sm border border-blue-800/30">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                        </svg>
                      </div>
                      <a href={user.role === 'admin' ? '/admin' : '/dashboard'}>
                        <span>Dashboard</span>
                      </a>
                    </button>
                  </div>

                  <div className="p-2 border-t border-slate-800/50">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-400 hover:text-red-300 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 rounded-xl transition-all duration-200 group"
                    >
                      <div className="h-9 w-9 rounded-lg bg-gradient-to-br from-red-900/20 to-slate-800 flex items-center justify-center group-hover:from-red-800/30 group-hover:to-slate-700 text-red-500 group-hover:text-red-400 transition-all shadow-sm border border-red-900/30">
                        <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                        </svg>
                      </div>
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Mobile Menu Hamburger Button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className={`relative p-3 rounded-xl bg-gradient-to-br from-slate-800 to-blue-900/30 border border-slate-700 shadow-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-all duration-200 active:scale-95 focus:outline-none ${
                isMobileMenuOpen ? 'bg-slate-800 text-white' : ''
              }`}
            >
              {isMobileMenuOpen ? (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu Dropdown */}
        {isMobileMenuOpen && (
          <div 
            ref={mobileMenuRef}
            className="md:hidden absolute top-16 left-4 right-4 bg-slate-900/95 backdrop-blur-2xl border border-slate-800 rounded-2xl shadow-2xl shadow-blue-500/20 z-50 animate-slideDown overflow-hidden mt-2"
          >
            <div className="p-2 space-y-2">
              {/* User Header */}
              <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-900/20 to-indigo-900/20 rounded-xl border border-slate-800 mx-2 mt-2">
                <div className="h-12 w-12 bg-gradient-to-br from-indigo-700 via-blue-800 to-slate-900 rounded-xl flex items-center justify-center font-bold text-blue-300 text-lg shadow-md">
                  {getInitials(user.email)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-slate-200 truncate">
                    {user.email}
                  </p>
                  <div className="mt-1.5">{getRoleBadge(user.role)}</div>
                </div>
              </div>

              {/* Links */}
              <div className="px-2 pt-2 pb-4 space-y-1">
                <button
                  onClick={handleNavigateHome}
                  className="w-full flex items-center gap-4 px-4 py-3 text-slate-300 hover:text-white hover:bg-gradient-to-r hover:from-blue-900/30 hover:to-indigo-900/20 rounded-xl transition-all duration-200 font-medium"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-blue-900/30 to-slate-800 text-blue-400 hover:text-blue-300 shadow-sm border border-blue-800/30">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Dashboard</span>
                </button>

                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-4 px-4 py-3 text-red-400 hover:bg-gradient-to-r hover:from-red-900/20 hover:to-red-800/10 rounded-xl transition-all duration-200 font-bold mt-2 border-t border-slate-800/50 pt-4"
                >
                  <div className="p-2 rounded-lg bg-gradient-to-br from-red-900/20 to-slate-800 text-red-500 hover:text-red-400 shadow-sm border border-red-900/30">
                    <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium">Sign Out</span>
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 15s infinite alternate cubic-bezier(0.4, 0, 0.2, 1);
        }
        @keyframes slideDown {
          from { 
            opacity: 0; 
            transform: translateY(-20px) scale(0.95); 
          }
          to { 
            opacity: 1; 
            transform: translateY(0) scale(1); 
          }
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
        .animation-delay-2000 { animation-delay: 3s; }
        .animation-delay-4000 { animation-delay: 6s; }
      `}</style>
    </nav>
  );
}