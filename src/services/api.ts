import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:2002/api",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Don't redirect on /auth/me failures - let AuthProvider handle it
    const isAuthCheck = error.config?.url?.includes('/auth/me');

    if (!isAuthCheck && error.response?.status === 401) {
      // Only redirect to login for protected API calls, not auth checks
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);
export default api;
