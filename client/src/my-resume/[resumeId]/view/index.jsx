import Header from 'client/src/components/custom/Header';
import { Button } from 'client/src/components/ui/button';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import ResumePreview from 'client/src/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../../../service/GlobalApi'; // ✅ updated import
import { RWebShare } from 'react-web-share';
import { toast } from 'sonner';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(null);
  const { resumeId } = useParams();
  const { GetResumeById } = useApiClient(); // ✅ new secured API client

  useEffect(() => {
    if (resumeId && resumeId !== 'undefined') {
      GetResumeInfo();
    } else {
      console.warn('⚠️ Invalid resumeId, skipping fetch');
    }
  }, [resumeId]);

  const GetResumeInfo = async () => {
    try {
      const data = await GetResumeById(resumeId);
      console.log('✅ Resume data fetched:', data);
      setResumeInfo(data);
    } catch (error) {
      console.error('❌ Error fetching resume:', error);
      toast.error('Failed to load resume details.');
    }
  };

  const HandleDownload = () => {
    window.print();
  };

  const shareUrl = `${import.meta.env.VITE_BASE_URL}/my-resume/${resumeId}/view`;

  return (
    <ResumeInfoContext.Provider value={{ resumeInfo, setResumeInfo }}>
      <div id="no-print">
        <Header />

        <div className="my-10 mx-10 md:mx-20 lg:mx-36">
          <h2 className="text-center text-2xl font-medium">
            Congrats! Your Ultimate AI-generated Resume is ready!
          </h2>
          <p className="text-center text-gray-400">
            Now you can download or share your unique resume link with anyone.
          </p>

          <div className="flex justify-between px-44 my-10">
            <Button onClick={HandleDownload}>Download</Button>

            <RWebShare
              data={{
                text: 'Check out my resume!',
                url: shareUrl,
                title: resumeInfo
                  ? `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume`
                  : 'My Resume',
              }}
              onClick={() => toast.success('Shared successfully!')}
            >
              <Button>Share</Button>
            </RWebShare>
          </div>
        </div>
      </div>

      <div className="my-10 mx-10 md:mx-20 lg:mx-36">
        <div id="print-area">
          <ResumePreview />
        </div>
      </div>
    </ResumeInfoContext.Provider>
  );
}

export default ViewResume;
