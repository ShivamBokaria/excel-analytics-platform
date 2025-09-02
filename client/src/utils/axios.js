import axios from "axios";
import { API_BASE_URL } from "../config/config";

// Debug logging
console.log('API Base URL:', API_BASE_URL);

const API = axios.create({
  baseURL: "https://excel-analytics-platform-kofn.onrender.com/api", // change to Render URL in prod
});



// Request interceptor
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  
  // Debug logging
  console.log('Making request to:', req.baseURL + req.url);
  
  return req;
});

// Response interceptor for better error handling
API.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      data: error.response?.data
    });
    return Promise.reject(error);
  }
);

export default API;
