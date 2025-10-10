import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import dummy from 'client/src/dashboard/data/dummy';
import { useApiClient } from '../../../../../service/GlobalApi'; // ✅ updated import
import { toast } from 'sonner';

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(null);
  const { GetResumeById } = useApiClient(); // ✅ use the Clerk-secured API

  useEffect(() => {
    if (resumeId && resumeId !== 'undefined') {
      GetResumeInfoWithRetry();
    } else {
      console.warn('⚠️ resumeId is missing or invalid. Using dummy resume.');
      setResumeInfo(dummy);
    }
  }, [resumeId]);

  const GetResumeInfoWithRetry = async (retries = 3, delay = 500) => {
    try {
      const data = await GetResumeById(resumeId);

      if (!data) {
        throw new Error('Resume not found or unauthorized');
      }

      // ✅ Normalize ID fields (for consistent handling)
      if (!data.resumeId && data.documentId) {
        data.resumeId = data.documentId;
      }

      console.log('✅ Resume data fetched:', data);
      setResumeInfo(data);
    } catch (error) {
      console.error('❌ Error fetching resume:', error);

      if (retries > 0) {
        console.warn(`🔁 Retrying fetch... attempts left: ${retries - 1}`);
        setTimeout(() => {
          GetResumeInfoWithRetry(retries - 1, delay * 2); // exponential backoff
        }, delay);
      } else {
        toast.error('Failed to fetch resume. Using dummy data.');
        console.warn('⚠️ Failed to fetch resume after retries. Using dummy data.');
        setResumeInfo(dummy);
      }
    }
  };

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div className="grid grid-cols-1 md:grid-cols-2 p-10 gap-10">
        <FormSection />
        <ResumePreview />
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default EditResume;
