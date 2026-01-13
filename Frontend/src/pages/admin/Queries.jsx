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
        setQueries(res.data.queries);
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
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 py-4">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Header */}
          <div className="mb-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
              <div>
                <h1 className="text-xl font-semibold text-gray-900 mb-1">User Queries</h1>
                <p className="text-sm text-gray-600 flex items-center space-x-1.5">
                  <svg className="h-4 w-4" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <span>Monitor all user questions & answers</span>
                </p>
              </div>
              <div className="px-3 py-2 bg-white rounded-lg shadow-sm border border-gray-200">
                <p className="text-xs text-gray-600">Total Queries</p>
                <p className="text-lg font-semibold text-purple-600">{queries.length}</p>
              </div>
            </div>

            {/* Search Bar */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                  <svg className="h-4 w-4 text-gray-400" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search queries by question, answer, or user email..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          {/* Queries List */}
          {loading ? (
            <div className="flex flex-col items-center justify-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="h-10 w-10 border-3 border-gray-200 border-t-purple-600 rounded-full animate-spin"></div>
              <p className="mt-3 text-gray-600 text-sm">Loading queries...</p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredQueries.length === 0 ? (
                <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
                  <svg className="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                  </svg>
                  <p className="text-gray-600 font-medium text-sm mb-1">No queries found</p>
                  <p className="text-gray-400 text-xs">Try adjusting your search</p>
                </div>
              ) : (
                filteredQueries.map((q, index) => (
                  <div
                    key={index}
                    className="bg-white rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
                  >
                    {/* Header */}
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div className="h-8 w-8 bg-purple-600 rounded-lg flex items-center justify-center text-white text-xs font-semibold">
                            {q.userEmail.slice(0, 2).toUpperCase()}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{q.userEmail}</p>
                            <p className="text-xs text-gray-500 flex items-center space-x-1">
                              <svg className="h-3 w-3" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              <span>{formatDate(q.createdAt)}</span>
                            </p>
                          </div>
                        </div>
                        <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs font-medium rounded border border-purple-200">
                          #{index + 1}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-4">
                      {/* Question */}
                      <div className="mb-3">
                        <div className="flex items-start space-x-2">
                          <div className="h-7 w-7 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="h-4 w-4 text-blue-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-gray-500 uppercase mb-1">Question</p>
                            <p className="text-sm text-gray-900 leading-relaxed">{q.question}</p>
                          </div>
                        </div>
                      </div>

                      {/* Answer */}
                      <div className="bg-purple-50 rounded-lg p-3 border border-purple-100">
                        <div className="flex items-start space-x-2">
                          <div className="h-7 w-7 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                            <svg className="h-4 w-4 text-purple-600" fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" viewBox="0 0 24 24" stroke="currentColor">
                              <path d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                            </svg>
                          </div>
                          <div className="flex-1">
                            <p className="text-xs font-medium text-purple-700 uppercase mb-1">AI Answer</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{q.answer}</p>
                          </div>
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