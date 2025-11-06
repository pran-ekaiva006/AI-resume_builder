// client/service/GlobalApi.js

import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// ✅ Backend URL from .env (should NOT include /api)
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const useApiClient = () => {
  const { getToken } = useAuth();

  const axiosClient = axios.create({
    baseURL: API_BASE, // "/api" will be added below
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  // ✅ Attach Clerk JWT
  axiosClient.interceptors.request.use(async (config) => {
    const token = await getToken({ template: "default" });

    if (token) {
      console.log("✅ Token attached");
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  });

  const handleResponse = (res) => res.data;
  const handleError = (error, action) => {
    console.error(`❌ ${action} failed:`, error.response?.data || error.message);
    throw error.response?.data || error;
  };

  return {
    CreateNewResume: async (data) => {
      const res = await axiosClient.post(`/api/resumes`, data);
      return handleResponse(res);
    },

    GetUserResumes: async () => {
      const res = await axiosClient.get(`/api/resumes`);
      return handleResponse(res);
    },

    GetResumeById: async (resumeId) => {
      const res = await axiosClient.get(`/api/resumes/${resumeId}`);
      return handleResponse(res);
    },

    UpdateResumeDetail: async (resumeId, data) => {
      const res = await axiosClient.put(`/api/resumes/${resumeId}`, data);
      return handleResponse(res);
    },

    DeleteResumeById: async (resumeId) => {
      const res = await axiosClient.delete(`/api/resumes/${resumeId}`);
      return handleResponse(res);
    },
  };
};
