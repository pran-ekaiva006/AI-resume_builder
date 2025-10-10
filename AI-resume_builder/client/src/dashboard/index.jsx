import React, { useEffect, useState } from 'react';
import AddResume from './components/AddResume';
import { useUser } from '@clerk/clerk-react';
import GlobalApi from '../../service/GlobalApi';
import ResumeCardItem from './components/ResumeCardItem';

function Dashboard() {
  const { user } = useUser();
  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user) {
      console.log('Fetching resumes for:', user.primaryEmailAddress?.emailAddress);
      GetResumesList();
    }
  }, [user]);

  /**
   * Used to Get User's Resume List
   */
  const GetResumesList = () => {
    GlobalApi.GetUserResumes()
      .then(resumes => {
        console.log('Response data:', resumes);
        setResumeList(Array.isArray(resumes) ? resumes : []);
      })
      .catch(error => {
        console.error('Error fetching resumes:', error);
        setResumeList([]);
      });
  };

  return (
    <div className='p-10 md:px-20 lg:px-32'>
      <h2 className='font-bold text-3xl'>My Resume</h2>
      <p>Start creating an AI resume for your next job role</p>
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10'>
        <AddResume />
        {resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={resume._id || index}
              refreshData={GetResumesList}
            />
          ))
        ) : (
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className='h-[280px] rounded-lg bg-slate-200 animate-pulse'
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;