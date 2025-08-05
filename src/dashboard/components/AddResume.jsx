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
import { v4 as uuidv4 } from 'uuid';
import GlobalApi from './../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';

function AddResume() {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const { user } = useUser();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  

const onCreate = async () => {
  if (!resumeTitle) return;

  setLoading(true);
  const uuid = uuidv4();

  const resumeData = {
    title: resumeTitle,
    resumeId: uuid,
    userEmail: user?.primaryEmailAddress?.emailAddress || '',
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',

    themeColor: "#ff6666",
    phone: "",
    email: "",
    address: "",
    jobTitle: "",
    summery: "",
    experience: [],
    education: [],
    skills: [],
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
