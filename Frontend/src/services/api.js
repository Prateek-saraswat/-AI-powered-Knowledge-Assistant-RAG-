import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000",
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    // console.log(token);

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => {
    // ✅ success response untouched
    return response;
  },
  (error) => {
    const normalizedError = {
      success: false,
      message:
        error.response?.data?.message ||
        error.response?.data?.error ||
        error.message ||
        "Something went wrong",
      status: error.response?.status || 500,
    };

    // attach standardized error
    error.normalized = normalizedError;

    // OPTIONAL: auto logout on 401 (safe)
    if (normalizedError.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
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


export const authAPI = {
  login: (data) => api.post("/auth/login", data),
  register: (data) => api.post("/auth/register", data),
  logout: () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },
};


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
    
    if (!payload.documentId) {
      console.error("Missing documentId in payload!");
      return Promise.reject(new Error("documentId is required"));
    }
    
    return api.post("/chat/ask", payload);
  },
  history: (documentId) => {
    console.log(documentId);
    
    if (!documentId || documentId === "undefined") {
      console.error(documentId);
      return Promise.reject(new Error("Valid documentId is required"));
    }
    
    return api.get(`/chat/history?documentId=${documentId}`);
  },
};


export const adminAPI = {
  stats: () => api.get("/admin/stats"),
  
  users: () => api.get("/admin/users"),
  userDocuments: (userId) => api.get(`/admin/users/${userId}/documents`),
  userQueries: (userId) => api.get(`/admin/users/${userId}/queries`),
  
  documents: () => api.get("/admin/documents"),
  toggleDocument: (id) => api.patch(`/admin/documents/${id}/toggle`),
  
  queries: () => api.get("/admin/queries"),
  usage: () => api.get("/admin/usage"),
};

export default api;