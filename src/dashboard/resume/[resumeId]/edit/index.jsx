import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
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
      GetResumeInfo();
    } else {
      console.warn("⚠️ resumeId is missing or invalid. Using dummy resume.");
      setResumeInfo(dummy);
    }
  }, [resumeId]);

  const GetResumeInfo = () => {
    GlobalApi.GetResumeById(resumeId)
      .then((data) => {
        console.log("✅ Resume fetched:", data);
        setResumeInfo(data);
      })
      .catch((err) => {
        console.error("❌ Error fetching resume:", err);
        setResumeInfo(dummy); // fallback if error
      });
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
