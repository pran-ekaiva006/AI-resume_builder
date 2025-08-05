import axios from 'axios';

// ✅ Use environment variable OR fallback to localhost
const API_BASE = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api').trim();

// ✅ Create an axios instance with default headers
const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ✅ Create a new resume
const CreateNewResume = (data) =>
  axiosClient.post('/resumes', data).then((res) => res.data);

// ✅ Get all resumes
const GetUserResumes = () =>
  axiosClient.get('/resumes').then((res) => res.data);

// ✅ Get a specific resume by MongoDB _id
const GetResumeById = (id) =>
  axiosClient.get(`/resumes/${id}`).then((res) => res.data);

// ✅ Update a resume by MongoDB _id
const UpdateResumeDetail = (id, data) =>
  axiosClient.put(`/resumes/${id}`, data).then((res) => res.data);

// ✅ Delete a resume by MongoDB _id
const DeleteResumeById = (id) =>
  axiosClient.delete(`/resumes/${id}`).then((res) => res.data);

// ✅ Export all functions
export default {
  CreateNewResume,
  GetUserResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,
};
