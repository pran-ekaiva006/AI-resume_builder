import axios from "axios";
import { useAuth } from "@clerk/clerk-react";

// ✅ Backend base URL
const API_BASE = ("https://ai-resume-builder-3-rdhw.onrender.com/api").trim();

// ✅ Factory function that creates an axios client with the Clerk token
export const useApiClient = () => {
  const { getToken } = useAuth();

  // Returns axios instance that automatically adds Clerk JWT
  const axiosClient = axios.create({
    baseURL: API_BASE,
    headers: { "Content-Type": "application/json" },
  });

  // Add interceptor to attach Authorization header
  axiosClient.interceptors.request.use(async (config) => {
    const token = await getToken();
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  });

  return {
    // ✅ Create a new resume
    CreateNewResume: (data) => axiosClient.post("/resumes", data).then((res) => res.data),

    // ✅ Get all resumes for the current Clerk user
    GetUserResumes: () => axiosClient.get("/resumes").then((res) => res.data),

    // ✅ Get specific resume by ID
    GetResumeById: (resumeId) =>
      axiosClient.get(`/resumes/resumeId/${resumeId}`).then((res) => res.data),

    // ✅ Update resume
    UpdateResumeDetail: (resumeId, data) =>
      axiosClient.put(`/resumes/resumeId/${resumeId}`, data).then((res) => res.data),

    // ✅ Delete resume
    DeleteResumeById: (resumeId) =>
      axiosClient.delete(`/resumes/resumeId/${resumeId}`).then((res) => res.data),
  };
};
