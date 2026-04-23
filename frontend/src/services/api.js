import axios from "axios";
import { clearToken, getToken } from "../utils/auth";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://`${process.env.REACT_APP_API_URL}/api/auth/login`/api"
});

api.interceptors.request.use((config) => {
  const token = getToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      clearToken();
    }
    return Promise.reject(error);
  }
);

export const authService = {
  register: (payload) => api.post("/auth/register", payload),
  login: (payload) => api.post("/auth/login", payload)
};

export const bookService = {
  getAll: () => api.get("/books"),
  create: (payload) => api.post("/books", payload),
  update: (id, payload) => api.put(`/books/${id}`, payload),
  remove: (id) => api.delete(`/books/${id}`)
};

export const userService = {
  getAll: () => api.get("/users"),
  create: (payload) => api.post("/users", payload),
  remove: (id) => api.delete(`/users/${id}`)
};

export const issueService = {
  issue: (payload) => api.post("/issue", payload),
  returnBook: (payload) => api.post("/return", payload)
};

export default api;
