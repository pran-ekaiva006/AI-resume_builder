import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// ✅ Backend URL from .env (should NOT include /api at the end)
const API_BASE = import.meta.env.VITE_BACKEND_URL;

export const useApiClient = () => {
  const { getToken } = useAuth();

  const axiosClient = axios.create({
    baseURL: `${API_BASE}/api`, //  add /api ONLY here
    withCredentials: true,
    headers: { "Content-Type": "application/json" },
  });

  axiosClient.interceptors.request.use(async (config) => {
    const token = await getToken({ template: "default" });
    if (token) {
      console.log("✅ Token attached");
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });

  const handleResponse = (res) => res.data;

  return {
    CreateNewResume: async (data) => {
      const res = await axiosClient.post(`/resumes`, data); 
      return handleResponse(res);
    },

    GetUserResumes: async () => {
      const res = await axiosClient.get(`/resumes`); 
      return handleResponse(res);
    },

    GetResumeById: async (resumeId) => {
      const res = await axiosClient.get(`/resumes/${resumeId}`); 
      return handleResponse(res);
    },

    UpdateResumeDetail: async (resumeId, data) => {
      const res = await axiosClient.put(`/resumes/${resumeId}`, data);
      return handleResponse(res);
    },

    DeleteResumeById: async (resumeId) => {
      const res = await axiosClient.delete(`/resumes/${resumeId}`); 
      return handleResponse(res);
    },
  };
};
