import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import FormSection from '../../components/FormSection';
import ResumePreview from '../../components/ResumePreview';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import dummy from '@/dashboard/data/dummy';

import GlobalApi from './../../../../../service/GlobalApi';

function EditResume() {
    const {resumeId}=useParams();
    const [resumeInfo,setResumeInfo]=useState();
    useEffect(()=>{
       
        setResumeInfo(dummy);
    },[])

    const GetResumeInfo = () => {
      GlobalApi.GetResumeById(resumeId)
        .then((data) => {
          console.log("✅ Resume fetched:", data);
          setResumeInfo(data); // Updated: API already returns .data
        })
        .catch((err) => {
          console.error("❌ Error fetching resume:", err);
        });
    };

  return (
    <ResumeInfoContext.Provider value={{resumeInfo,setResumeInfo}}>
    <div className='grid grid-cols-1 md:grid-cols-2 p-10 gap-10'>
        {/* Form Section  */}
          <FormSection/>
        {/* Preview Section  */}
         <ResumePreview/>
    </div>
    </ResumeInfoContext.Provider>
  )
}

export default EditResume