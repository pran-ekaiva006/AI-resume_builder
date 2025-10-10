import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import dummy from 'client/src/dashboard/data/dummy';
import { useApiClient } from '../../../../../service/GlobalApi';
import { toast } from 'sonner';

function EditResume() {
  const { resumeId } = useParams();
  const [resumeInfo, setResumeInfo] = useState(dummy); // ✅ start with dummy immediately
  const { GetResumeById } = useApiClient();

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
      const response = await GetResumeById(resumeId);
      const data = response?.data || response; // ✅ handle both {data: {...}} or plain {...}

      if (!data || Object.keys(data).length === 0) {
        throw new Error('Resume not found or empty');
      }

      // ✅ Normalize structure — if backend sends only partial data, merge with dummy
      const mergedData = {
        ...dummy,
        ...data,
        experience: data.experience?.length ? data.experience : dummy.experience,
        education: data.education?.length ? data.education : dummy.education,
        skills: data.skills?.length ? data.skills : dummy.skills,
      };

      console.log('✅ Resume data fetched:', mergedData);
      setResumeInfo(mergedData);
    } catch (error) {
      console.error('❌ Error fetching resume:', error);

      if (retries > 0) {
        console.warn(`🔁 Retrying fetch... attempts left: ${retries - 1}`);
        setTimeout(() => {
          GetResumeInfoWithRetry(retries - 1, delay * 2);
        }, delay);
      } else {
        toast.error('Failed to fetch resume. Showing dummy data.');
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
