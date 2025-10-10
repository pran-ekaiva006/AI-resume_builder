import { Loader2, PlusSquare } from 'lucide-react';
import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "client/src/components/ui/dialog";
import { Button } from 'client/src/components/ui/button';
import { Input } from 'client/src/components/ui/input';
import { useApiClient } from '../../../service/GlobalApi';
import { useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';

function AddResume({ refreshData }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useUser();
  const navigate = useNavigate();
  const { CreateNewResume } = useApiClient();

  const onCreate = async () => {
    if (!resumeTitle.trim()) {
      toast.error("Please enter a resume title.");
      return;
    }

    setLoading(true);
    const resumeId = uuidv4();

    const resumeData = {
      resumeId,
      title: resumeTitle.trim(),
      userEmail: user?.primaryEmailAddress?.emailAddress || 'no-email@example.com',
      firstName: user?.firstName || 'First',
      lastName: user?.lastName || 'Last',
      jobTitle: 'Full Stack Developer',
      themeColor: "#ff6666",
      phone: "(123)-456-7890",
      address: "525 N Tryon Street, NC 28117",
      summery:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      experience: [
        {
          id: 1,
          title: 'Full Stack Developer',
          companyName: 'Amazon',
          city: 'New York',
          state: 'NY',
          startDate: 'Jan 2021',
          endDate: 'June 2025',
          currentlyWorking: true,
          workSummery:
            '• Developed full-stack apps using React & Node.js.\n' +
            '• Created REST APIs and responsive UIs.\n' +
            '• Maintained React Native in-house apps.',
        },
      ],
      education: [
        {
          id: 1,
          universityName: 'Western Illinois University',
          startDate: 'Aug 2018',
          endDate: 'Dec 2019',
          degree: 'Master',
          major: 'Computer Science',
          description: 'Graduated with distinction in software engineering.',
        },
      ],
      skills: [
        { id: 1, name: 'Angular', rating: 80 },
        { id: 2, name: 'React', rating: 100 },
        { id: 3, name: 'MySQL', rating: 80 },
        { id: 4, name: 'React Native', rating: 100 },
      ],
    };

    try {
      console.log("📤 Sending resumeData:", resumeData); // ✅ Debug log to verify title
      const response = await CreateNewResume(resumeData);
      console.log("✅ New resume created:", response);

      // Refresh Dashboard data so the title shows immediately
      if (refreshData) await refreshData();

      toast.success("Resume created successfully!");
      setOpenDialog(false);
      setResumeTitle(''); // Reset input
      navigate(`/dashboard/resume/${resumeId}/edit`);
    } catch (error) {
      console.error("❌ Failed to create resume:", error);
      toast.error("Resume creation failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        className="p-14 py-24 border items-center flex justify-center bg-secondary
        rounded-lg h-[280px] hover:scale-105 transition-all hover:shadow-md
        cursor-pointer border-dashed"
        onClick={() => setOpenDialog(true)}
      >
        <PlusSquare />
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Resume</DialogTitle>
            <DialogDescription>
              Add a title for your new resume
            </DialogDescription>
          </DialogHeader>

          <Input
            className="my-2"
            placeholder="Ex. Frontend Developer Resume"
            value={resumeTitle}
            onChange={(e) => {
              console.log("✏️ Input changed:", e.target.value); // ✅ Debug input tracking
              setResumeTitle(e.target.value);
            }}
          />

          <div className="flex justify-end gap-5 mt-4">
            <Button onClick={() => setOpenDialog(false)} variant="ghost">
              Cancel
            </Button>
            <Button disabled={!resumeTitle.trim() || loading} onClick={onCreate}>
              {loading ? <Loader2 className="animate-spin" /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
