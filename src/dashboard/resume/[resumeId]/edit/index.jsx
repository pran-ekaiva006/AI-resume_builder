import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import dummy from '@/dashboard/data/dummy';
import GlobalApi from './../../../../../service/GlobalApi';

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);

  useEffect(() => {
    if (resumeId && resumeId !== 'undefined') {
      GetResumeInfoWithRetry();
    } else {
      console.warn("⚠️ resumeId is missing or invalid. Using dummy resume.");
      setResumeInfo(dummy);
    }
  }, [resumeId]);

  const GetResumeInfoWithRetry = async (retries = 3, delay = 500) => {
    try {
      // ✅ Now fetching by UUID-based route
      const data = await GlobalApi.GetResumeById(resumeId);

      // Ensure resumeId is always present
      if (!data.resumeId && data.documentId) {
        data.resumeId = data.documentId;
      }

      setResumeInfo(data);
    } catch (error) {
      console.error("❌ Error fetching resume:", error);

      if (retries > 0) {
        setTimeout(() => {
          GetResumeInfoWithRetry(retries - 1, delay * 2); // exponential backoff
        }, delay);
      } else {
        console.warn("⚠️ Failed to fetch resume after retries. Using dummy data.");
        setResumeInfo(dummy); // fallback
      }
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;