// src/utils/axios.ts
import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:8080/api", // Set the base URL for your API
  headers: {
    "Content-Type": "application/json",
  },
});

export const authFetch = axios.create({
  // baseURL: "https://databin-meridianit.com/backend/v2",
  baseURL: "http://localhost:3000/v2",
});
