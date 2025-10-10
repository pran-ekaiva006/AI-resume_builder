import axios from 'axios';

// ✅ Use environment variable OR fallback to localhost
const API_BASE = ( 'https://ai-resume-builder-3-rdhw.onrender.com/api').trim();

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

// ✅ Get a specific resume by resumeId (UUID)
const GetResumeById = (resumeId) =>
  axiosClient.get(`/resumes/resumeId/${resumeId}`).then((res) => res.data);

// ✅ Update a resume by resumeId (UUID)
const UpdateResumeDetail = (resumeId, data) =>
  axiosClient.put(`/resumes/resumeId/${resumeId}`, data).then((res) => res.data);

// ✅ Delete a resume by resumeId (UUID)
const DeleteResumeById = (resumeId) =>
  axiosClient.delete(`/resumes/resumeId/${resumeId}`).then((res) => res.data);

// ✅ Export all functions
export default {
  CreateNewResume,
  GetUserResumes,
  GetResumeById,
  UpdateResumeDetail,
  DeleteResumeById,
};