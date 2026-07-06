import { Loader2Icon, MoreVertical } from 'lucide-react';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "client/src/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "client/src/components/ui/alert-dialog";
import { useApiClient } from '../../../service/GlobalApi';
import { toast } from 'sonner';
import { useTiltEffect } from '../../hooks/useTiltEffect';

function ResumeCardItem({ resume, refreshData }) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const tiltRef = useTiltEffect({ maxAngle: 5, scale: 1.02 });

  const { DeleteResumeById } = useApiClient();

  const onDelete = async () => {
    try {
      setLoading(true);
      toast.loading('Deleting resume...', { id: 'delete-toast' });
      
      await DeleteResumeById(resume.resumeId);
      
      toast.success('Resume deleted successfully!', { id: 'delete-toast' });
      refreshData();
    } catch (error) {
      console.error("❌ Failed to delete resume:", error);
      toast.error(
        error.response?.status === 403 
          ? 'Permission denied' 
          : 'Failed to delete resume',
        { id: 'delete-toast' }
      );
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  const resumeTitle = resume?.title?.trim() || "Untitled Resume";
  const themeColor = resume?.themeColor || "var(--brass)";
  const createdAt = resume?.createdAt
    ? new Date(resume.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : "Recently Created";

  const resumeId = resume?.resumeId;

  const hasSummary = Boolean(resume?.summery?.trim());
  const hasExperience = Array.isArray(resume?.experience) && resume.experience.length > 0;
  const hasEducation = Array.isArray(resume?.education) && resume.education.length > 0;
  const hasSkills = Array.isArray(resume?.skills) && resume.skills.length > 0;

  const completionScore = [hasSummary, hasExperience, hasEducation, hasSkills].filter(Boolean).length;
  const completionPercentage = Math.round((completionScore / 4) * 100);
  const isPublic = resume?.isPublic || false;

  return (
    <div 
      ref={tiltRef}
      className="group relative bg-parchment text-text-on-light rounded-xl flex flex-col h-[280px] border border-ink/20 shadow-[4px_4px_0_var(--ink),8px_8px_0_rgba(16,19,28,0.05)] hover:shadow-[6px_6px_0_var(--ink),12px_12px_0_rgba(16,19,28,0.08)] transition-shadow duration-300"
    >
      <Link to={`/dashboard/resume/${resumeId}/edit`} className="flex-1 flex flex-col cursor-pointer relative overflow-hidden rounded-t-xl">
        {/* Public/Private Badge */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/60 border border-ink/10 backdrop-blur-md z-20 shadow-sm transition-opacity group-hover:opacity-100">
          <div className={`w-1.5 h-1.5 rounded-full ${isPublic ? 'bg-teal shadow-[0_0_4px_var(--teal)]' : 'bg-ink/30'}`} />
          <span className="font-mono text-[9px] uppercase tracking-wider text-ink/70 font-medium">
            {isPublic ? 'Public' : 'Private'}
          </span>
        </div>
        
        {/* Card Body */}
        <div className="flex-1 flex items-center justify-center p-6 relative">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-bl-full pointer-events-none -z-0"></div>
          <img src="/cv.png" width={64} height={64} alt="Resume Icon" className="relative z-10 opacity-90 drop-shadow-sm group-hover:scale-105 transition-transform duration-300" />
        </div>

        {/* Completion Indicator */}
        <div className="absolute bottom-3 left-4 right-4 z-20">
          <div className="flex justify-between items-center mb-1.5">
            <span className="font-mono text-[9px] uppercase tracking-wider text-ink/50">Completion</span>
            <span className="font-mono text-[9px] font-semibold text-ink/70">{completionPercentage}%</span>
          </div>
          <div className="h-1 w-full bg-ink/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-brass rounded-full transition-all duration-1000 ease-out" 
              style={{ width: `${completionPercentage}%` }}
            />
          </div>
        </div>
      </Link>

      {/* Footer Area */}
      <div className="border-t border-ink/10 p-4 flex justify-between items-center bg-white/50 rounded-b-xl backdrop-blur-sm z-20 text-text-on-light">
        <div className="flex-1 min-w-0 pr-2">
          <h2 className="font-display text-base font-bold text-text-on-light truncate">
            {resumeTitle}
          </h2>
          <p className="font-mono text-[10px] text-text-on-light/60 uppercase tracking-wider mt-1">
            {createdAt}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 -mr-2 rounded-md hover:bg-ink/5 transition-colors focus:outline-none text-text-on-light">
            <MoreVertical className="h-4 w-4 text-text-on-light/70" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40 font-body bg-parchment text-text-on-light border-ink/20 shadow-lg">
            <DropdownMenuItem onClick={() => navigate(`/dashboard/resume/${resumeId}/edit`)} className="cursor-pointer hover:bg-ink/5 focus:bg-ink/5 text-text-on-light">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/my-resume/${resumeId}/view`)} className="cursor-pointer hover:bg-ink/5 focus:bg-ink/5 text-text-on-light">
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)} className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent className="font-body bg-parchment text-text-on-light border-ink/20 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display font-bold text-text-on-light">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-text-on-light/70">
                This will permanently delete your resume from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)} className="border-ink/20 hover:bg-ink/5 text-text-on-light">
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading} className="bg-destructive hover:bg-destructive/90 text-white">
                {loading ? <Loader2Icon className="animate-spin h-4 w-4" /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;
