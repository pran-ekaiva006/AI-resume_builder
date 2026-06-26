import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import ResumePreview from 'client/src/dashboard/resume/components/ResumePreview';
import axios from 'axios';
import { LoaderCircle, FileText, ArrowRight } from 'lucide-react';
import { Button } from 'client/src/components/ui/button';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

function PublicResumeView() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { resumeId } = useParams();

  useEffect(() => {
    if (resumeId) {
      fetchPublicResume();
    }
  }, [resumeId]);

  const fetchPublicResume = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_BASE}/api/resumes/public/${resumeId}`);
      setResumeInfo(response.data.data);
    } catch (err) {
      console.error('Error fetching public resume:', err);
      setError('Resume not found or no longer available.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoaderCircle className="animate-spin h-10 w-10 text-blue-600" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Resume Not Found</h2>
          <p className="text-gray-500 mb-6">{error}</p>
          <Link to="/">
            <Button className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
              Go to Home
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="min-h-screen bg-gray-50">
        {/* Minimal branded header */}
        <header className="bg-white border-b border-gray-200">
          <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-1.5 rounded-lg">
                <FileText className="h-4 w-4 text-white" />
              </div>
              <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Pro
              </span>
            </Link>
            <Link to="/auth/sign-up">
              <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 text-white text-xs px-4 rounded-full flex items-center gap-1">
                Create your own <ArrowRight className="w-3 h-3" />
              </Button>
            </Link>
          </div>
        </header>

        {/* Resume info bar */}
        <div className="max-w-5xl mx-auto px-4 py-6">
          <h1 className="text-xl font-semibold text-gray-800">
            {resumeInfo?.firstName} {resumeInfo?.lastName}'s Resume
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            {resumeInfo?.jobTitle || 'Professional Resume'}
          </p>
        </div>

        {/* Resume preview */}
        <div className="max-w-4xl mx-auto px-4 pb-10">
          <div id="print-area">
            <ResumePreview />
          </div>
        </div>

        {/* Footer CTA */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 py-8">
          <div className="max-w-3xl mx-auto text-center px-4">
            <h3 className="text-lg font-semibold text-white mb-2">
              Impressed? Build your own AI-powered resume in minutes.
            </h3>
            <Link to="/auth/sign-up">
              <Button variant="secondary" className="mt-2 rounded-full px-6">
                Get Started Free <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default PublicResumeView;
