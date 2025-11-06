import Header from 'client/src/components/custom/Header';
import { Button } from 'client/src/components/ui/button';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import ResumePreview from 'client/src/dashboard/resume/components/ResumePreview';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApiClient } from '../../../../service/GlobalApi';
import { RWebShare } from 'react-web-share';
import { toast } from 'sonner';
import dummy from 'client/src/dashboard/data/dummy';

function ViewResume() {
  const [resumeInfo, setResumeInfo] = useState(dummy);  // ✅ load dummy initially
  const { resumeId } = useParams();
  const { GetResumeById } = useApiClient();

  useEffect(() => {
    if (resumeId && resumeId !== 'undefined') {
      GetResumeInfo();
    }
  }, [resumeId]);

  const GetResumeInfo = async () => {
    try {
      const response = await GetResumeById(resumeId);
      const data = response?.data || response;   // ✅ extract actual data

      if (!data || typeof data !== 'object') {
        throw new Error("Invalid resume data");
      }

      // ✅ Merge missing fields from dummy
      const mergedData = {
        ...dummy,
        ...data,
        experience: data.experience?.length ? data.experience : dummy.experience,
        education: data.education?.length ? data.education : dummy.education,
        skills: data.skills?.length ? data.skills : dummy.skills,
      };

      console.log("🔥 FINAL MERGED DATA FOR PREVIEW:", mergedData);
      setResumeInfo(mergedData);
    } catch (error) {
      console.error("❌ Error loading resume in View page:", error);
      toast.error("Failed to load resume. Showing default preview.");
      setResumeInfo(dummy);
    }
  };

  const HandleDownload = () => window.print();

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
                title: `${resumeInfo.firstName} ${resumeInfo.lastName}'s Resume`,
              }}
              onClick={() => toast.success("Shared successfully!")}
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
