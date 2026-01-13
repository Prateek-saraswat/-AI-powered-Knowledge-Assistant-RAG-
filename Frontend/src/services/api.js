console.log("🔥 api.js LOADED");
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});

/**
 * 🔐 Automatically attach JWT token to every request
 */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    console.log("🛰️ Interceptor running, token =", token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

/**
 * ❌ Auto logout on 401
 */
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     console.error("❌ API Error:", error.response?.data || error.message);
    
//     if (error.response && error.response.status === 401) {
//       localStorage.removeItem("token");
//       localStorage.removeItem("user");
//       window.location.href = "/login";
//     }
//     return Promise.reject(error);
//   }
// );

/* ================= AUTH ================= */

export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};

/* ================= USER ================= */

export const documentAPI = {
  list: () => api.get("/documents/list"),
  upload: (formData) =>
    api.post("/documents/upload", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
}; 

export const chatAPI = {
  ask: (payload) => {
    console.log("📤 Sending chat request:", payload);
    
    // Validate payload
    if (!payload.documentId) {
      console.error("❌ Missing documentId in payload!");
      return Promise.reject(new Error("documentId is required"));
    }
    
    return api.post("/chat/ask", payload);
  },
  history: (documentId) => {
    console.log("📤 Fetching chat history for documentId:", documentId);
    
    // Validate documentId
    if (!documentId || documentId === "undefined") {
      console.error("❌ Invalid documentId:", documentId);
      return Promise.reject(new Error("Valid documentId is required"));
    }
    
    return api.get(`/chat/history?documentId=${documentId}`);
  },
};

/* ================= ADMIN ================= */

export const adminAPI = {
  // Dashboard stats
  stats: () => api.get("/admin/stats"),
  
  // User management
  users: () => api.get("/admin/users"),
  userDocuments: (userId) => api.get(`/admin/users/${userId}/documents`),
  userQueries: (userId) => api.get(`/admin/users/${userId}/queries`),
  
  // Document management
  documents: () => api.get("/admin/documents"),
  toggleDocument: (id) => api.patch(`/admin/documents/${id}/toggle`),
  
  // Queries and usage
  queries: () => api.get("/admin/queries"),
  usage: () => api.get("/admin/usage"),
};

export default api;