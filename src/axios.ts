// src/utils/axios.ts
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Set the base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
