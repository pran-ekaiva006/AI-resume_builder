import axios from 'axios';

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5001/api';

export const createResume = data =>
  axios.post(`${API_BASE}/resumes`, data).then(res => res.data);

export const fetchResumes = () =>
  axios.get(`${API_BASE}/resumes`).then(res => res.data);

// Additional methods if needed
export const getResume = id =>
  axios.get(`${API_BASE}/resumes/${id}`).then(res => res.data);

export const updateResume = (id, data) =>
  axios.put(`${API_BASE}/resumes/${id}`, data).then(res => res.data);

export const deleteResume = id =>
  axios.delete(`${API_BASE}/resumes/${id}`).then(res => res.data);