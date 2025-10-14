import axios from "axios";

// Create an Axios instance
const api = axios.create({
  baseURL: "http://localhost:5001/api", // backend base URL
});

// Add JWT token to every request automatically
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token"); // token stored after login
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
