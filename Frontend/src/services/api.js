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
  ask: (payload) => api.post("/chat/ask", payload),
  history: (documentId) =>
    api.get(`/chat/history?documentId=${documentId}`),
};

/* ================= ADMIN ================= */

export const adminAPI = {
  documents: () => api.get("/admin/documents"),
  toggleDocument: (id) => api.patch(`/admin/documents/${id}/toggle`),
  queries: () => api.get("/admin/queries"),
  usage: () => api.get("/admin/usage"),
};

export default api;
