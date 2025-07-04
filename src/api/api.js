import axios from "axios";

const API_BASE_URL =
  "https://9hnjhclit1.execute-api.ap-south-1.amazonaws.com/Prod/stage";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      console.warn("No auth token found in localStorage");
    } else {
      // console.log("Attaching Token:", token);
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Error:", error.response?.data || error.message);
    if (error.response?.status === 401) {
      console.warn("Unauthorized - Removing invalid token");
      localStorage.removeItem("authToken");
    }

    return Promise.reject(error);
  }
);

export default api;
