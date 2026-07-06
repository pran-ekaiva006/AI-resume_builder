import axios from "axios";

const API_BASE = import.meta.env.DEV ? "" : (import.meta.env.VITE_BACKEND_URL || "");


export const axiosClient = axios.create({
  baseURL: `${API_BASE}/api`,
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});


let logoutCallback = null;

export const setLogoutCallback = (fn) => {
  logoutCallback = fn;
};

axiosClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only attempt refresh on 401 and only once per request
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/refresh') &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/signup')
    ) {
      originalRequest._retry = true;

      try {
        await axios.post(`${API_BASE}/api/auth/refresh`, {}, {
          withCredentials: true,
        });
        // Refresh succeeded — retry the original request
        return axiosClient(originalRequest);
      } catch (refreshError) {
        // Refresh also failed — session is truly expired
        if (logoutCallback) logoutCallback();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

// ── React hook that returns API methods ───────────────────────────
const handleResponse = (res) => res.data;

export const useApiClient = () => {
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
