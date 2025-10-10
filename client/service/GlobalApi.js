import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// ✅ Backend Base URL (deployed Render API)
const API_BASE = "https://ai-resume-builder-3-rdhw.onrender.com/api";

// ✅ Secure API client hook
export const useApiClient = () => {
  const { getToken } = useAuth();

  // Create axios instance
  const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  // 🔐 Attach Clerk JWT to all requests
  axiosClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  // 🔎 Centralized response handler
  const handleResponse = (res) => res.data;
  const handleError = (error, action) => {
    console.error(`❌ ${action} failed:`, error.response?.data || error.message);
    throw error;
  };

  return {
    /**
     * 🧠 Create new resume
     */
    CreateNewResume: async (data) => {
      try {
        console.log("📤 Sending resume creation request:", data);
        const res = await axiosClient.post("/resumes", data);
        console.log("✅ Resume created:", res.data);
        return handleResponse(res);
      } catch (error) {
        handleError(error, "CreateNewResume");
      }
    },

    /**
     * 📋 Get all resumes for current Clerk user
     */
    GetUserResumes: async () => {
      try {
        const res = await axiosClient.get("/resumes");
        console.log("📥 Fetched all resumes:", res.data);
        return handleResponse(res);
      } catch (error) {
        handleError(error, "GetUserResumes");
      }
    },

    /**
     * 🔍 Get specific resume by ID
     */
    GetResumeById: async (resumeId) => {
      try {
        const res = await axiosClient.get(`/resumes/resumeId/${resumeId}`);
        console.log("📄 Fetched resume:", res.data);
        return handleResponse(res);
      } catch (error) {
        handleError(error, "GetResumeById");
      }
    },

    /**
     * ✏️ Update resume details
     */
    UpdateResumeDetail: async (resumeId, data) => {
      try {
        const res = await axiosClient.put(`/resumes/resumeId/${resumeId}`, data);
        console.log("📝 Resume updated:", res.data);
        return handleResponse(res);
      } catch (error) {
        handleError(error, "UpdateResumeDetail");
      }
    },

    /**
     * 🗑️ Delete resume by ID
     */
    DeleteResumeById: async (resumeId) => {
      try {
        const res = await axiosClient.delete(`/resumes/resumeId/${resumeId}`);
        console.log("🗑️ Resume deleted:", res.data);
        return handleResponse(res);
      } catch (error) {
        handleError(error, "DeleteResumeById");
      }
    },
  };
};
