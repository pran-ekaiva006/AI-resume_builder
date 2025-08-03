// src/service/GlobalApi.js
import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';

const axiosClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Create a new resume
const CreateNewResume = (data) =>
  axiosClient.post('/resumes', data).then(res => res.data);

// Get all resumes (e.g., for a user)
const GetUserResumes = () =>
  axiosClient.get('/resumes').then(res => res.data);

// Get a specific resume by ID
const GetResumeById = (id) =>
  axiosClient.get(`/resumes/${id}`).then(res => res.data);

// Update a resume by ID
const UpdateResumeDetail = (id, data) =>
  axiosClient.put(`/resumes/${id}`, data).then(res => res.data);

// Delete a resume by ID
const DeleteResumeById = (id) =>
  axiosClient.delete(`/resumes/${id}`).then(res => res.data);

// Export all methods
export default {
  CreateNewResume,
  GetUserResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,
};
