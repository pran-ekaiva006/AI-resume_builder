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
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { toast } from 'sonner';
import { useTiltEffect } from '../../hooks/useTiltEffect';

function AddResume({ refreshData }) {
  const [openDialog, setOpenDialog] = useState(false);
  const [resumeTitle, setResumeTitle] = useState('');
  const [loading, setLoading] = useState(false);

  const { user } = useAuth();
  const navigate = useNavigate();
  const { CreateNewResume } = useApiClient();
  
  const tiltRef = useTiltEffect({ maxAngle: 4, scale: 1.02 });

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
      userEmail: user?.email || 'no-email@example.com',
      firstName: user?.firstName || 'First',
      lastName: user?.lastName || 'Last',
      jobTitle: resumeTitle.trim(),
      themeColor: "#ff6666",
      phone: "(123)-456-7890",
      address: "525 N Tryon Street, NC 28117",
      summery:
        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
      experience: [
        {
          id: 1,
          title: resumeTitle.trim(),
          companyName: 'Amazon',
          city: 'New York',
          state: 'NY',
          startDate: '2021-01-01',
          endDate: '2025-06-01',
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
          startDate: '2018-08-01',
          endDate: '2019-12-01',
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
      const response = await CreateNewResume(resumeData);

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
        ref={tiltRef}
        className="group bg-parchment text-text-on-light rounded-xl h-[280px] border border-ink/20 shadow-[4px_4px_0_var(--ink),8px_8px_0_rgba(16,19,28,0.05)] hover:shadow-[6px_6px_0_var(--ink),12px_12px_0_rgba(16,19,28,0.08)] transition-shadow duration-300 flex flex-col items-center justify-center cursor-pointer hover:text-text-on-light relative overflow-hidden"
        onClick={() => setOpenDialog(true)}
      >
        <div className="absolute inset-0 bg-ink/[0.02] opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <PlusSquare className="w-12 h-12 mb-3 stroke-[1.5] text-text-on-light/70 group-hover:text-text-on-light transition-colors" />
        <span className="font-display font-bold text-lg text-text-on-light/70 group-hover:text-text-on-light transition-colors">Create New</span>
      </div>

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="bg-parchment text-text-on-light border-ink/20 font-body shadow-xl">
          <DialogHeader>
            <DialogTitle className="font-display font-bold text-2xl text-text-on-light">Create New Resume</DialogTitle>
            <DialogDescription className="text-text-on-light/70">
              Add a title for your new resume
            </DialogDescription>
          </DialogHeader>

          <Input
            className="my-4 border-ink/30 text-text-on-light focus-visible:ring-brass bg-white/50"
            placeholder="Ex. Frontend Developer Resume"
            value={resumeTitle}
            onChange={(e) => setResumeTitle(e.target.value)}
          />

          <div className="flex justify-end gap-3 mt-2">
            <Button 
              onClick={() => setOpenDialog(false)} 
              variant="ghost" 
              className="hover:bg-ink/5 text-text-on-light/80"
            >
              Cancel
            </Button>
            <Button 
              disabled={!resumeTitle.trim() || loading} 
              onClick={onCreate}
              className="bg-brass hover:bg-brass/90 text-text-on-light font-semibold"
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : 'Create'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AddResume;
