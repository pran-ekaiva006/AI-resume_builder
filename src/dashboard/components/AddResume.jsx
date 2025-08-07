import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid'; // ✅ Required to generate unique resumeId

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const onCreate = async () => {
    if (!resumeTitle) return;
    setLoading(true);

    const resumeData = {
  resumeId: uuidv4(),
  title: resumeTitle,
  userEmail: user?.primaryEmailAddress?.emailAddress || 'exmaple@gmail.com',
  firstName: user?.firstName || 'First',
  lastName: user?.lastName || 'Last',
  jobTitle: 'full stack developer', // ✅ Default added
  themeColor: "#ff6666",
  phone: "(123)-456-7890",
  
  address: "525 N tryon Street, NC 28117",
  summery: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
  experience: [ {
            id:1,
            title:'Full Stack Developer',
            companyName:'Amazon',
            city:'New York',
            state:'NY',
            startDate:'Jan 2021',
            endDate:'june 2025',
            currentlyWorking:true,
            workSummery:' Designed, developed, and maintained full-stack applications using React and Node.js.\n'+
            '• Implemented responsive user interfaces with React, ensuring seamless user experiences across\n'+
            'various devices and browsers.\n'+
            '• Maintaining the React Native in-house organization application.'+
            '• CreatedRESTfulAPIs withNode.js and Express,facilitating data communicationbetween the front-end'+
            'and back-end systems.'
        },
      {
            id:2,
            title:'Frontend Developer',
            companyName:'Google',
            city:'Charlotte',
            state:'NC',
            startDate:'May 2019',
            endDate:'Jan 2021',
            currentlyWorking:false,
            workSummery:' Designed, developed, and maintained full-stack applications using React and Node.js.'+
            '• Implemented responsive user interfaces with React, ensuring seamless user experiences across'+
            'various devices and browsers.'+
            '• Maintaining the React Native in-house organization application.'+
            '• CreatedRESTfulAPIs withNode.js and Express,facilitating data communicationbetween the front-end'+
            'and back-end systems.'
        }],
  education: [ {
            id:1,
            universityName:'Western Illinois University',
            startDate:'Aug 2018',
            endDate:'Dec:2019',
            degree:'Master',
            major:'Computer Science',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        },
      {
            id:2,
            universityName:'Western Illinois University',
            startDate:'Aug 2018',
            endDate:'Dec:2019',
            degree:'Master',
            major:'Computer Science',
            description:'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud'
        }],
  skills: [ {
            id:1,
            name:'Angular',
            rating:80,
        },
        {
            id:1,
            name:'React',
            rating:100,
        },
        {
            id:1,
            name:'MySql',
            rating:80,
        },
        {
            id:1,
            name:'React Native',
            rating:100,
        }],
};

    try {
      console.log("📤 Sending resume data to backend:", resumeData);

      const response = await GlobalApi.CreateNewResume(resumeData);
      console.log("✅ Resume saved in MongoDB:", response);

      const resumeId = response?.resume?._id;

      if (resumeId) {
        console.log("🆔 MongoDB _id generated:", resumeId);
        navigate(`/dashboard/resume/${resumeId}/edit`);
      } else {
        console.error("❌ No _id returned. Something went wrong.");
        alert("Something went wrong. Resume was not created.");
      }
    } catch (error) {
      console.error("❌ Error creating resume:", error);
      alert("Failed to create resume. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className='p-14 py-24 border items-center flex justify-center bg-secondary
        rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed'
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
          </DialogHeader>
          <div>
            <DialogDescription>
              Add a title for your new resume
            </DialogDescription>
            <Input
              className="my-2"
              placeholder="Ex. Full Stack Resume"
              value={resumeTitle}
              onChange={(e) => setResumeTitle(e.target.value)}
            />
          </div>
          <div className='flex justify-end gap-5'>
            <Button onClick={() => setOpenDialog(false)} variant="ghost">
              Cancel
            </Button>
            <Button disabled={!resumeTitle || loading} onClick={onCreate}>
              {loading ? <Loader2 className='animate-spin' /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
