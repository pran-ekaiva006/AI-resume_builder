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
import { useTiltEffect } from '../../../hooks/useTiltEffect';

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

  return (
    <div 
      ref={tiltRef}
      className="group relative bg-parchment rounded-xl flex flex-col h-[280px] border border-ink/20 shadow-[4px_4px_0_var(--ink),8px_8px_0_rgba(16,19,28,0.05)] hover:shadow-[6px_6px_0_var(--ink),12px_12px_0_rgba(16,19,28,0.08)] transition-shadow duration-300"
    >
      <Link to={`/dashboard/resume/${resumeId}/edit`} className="flex-1 flex flex-col cursor-pointer">
        {/* Top Accent Bar */}
        <div 
          className="h-2 w-full rounded-t-xl" 
          style={{ backgroundColor: themeColor }}
        />
        
        {/* Card Body */}
        <div className="flex-1 flex items-center justify-center p-6 relative overflow-hidden">
          {/* Subtle background decoration */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-ink/5 rounded-bl-full pointer-events-none -z-0"></div>
          <img src="/cv.png" width={64} height={64} alt="Resume Icon" className="relative z-10 opacity-90 drop-shadow-sm group-hover:scale-105 transition-transform" />
        </div>
      </Link>

      {/* Footer Area */}
      <div className="border-t border-ink/10 p-4 flex justify-between items-center bg-white/50 rounded-b-xl backdrop-blur-sm z-20">
        <div className="flex-1 min-w-0 pr-2">
          <h2 className="font-display text-base font-bold text-ink truncate">
            {resumeTitle}
          </h2>
          <p className="font-mono text-[10px] text-ink/60 uppercase tracking-wider mt-1">
            {createdAt}
          </p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger className="p-2 -mr-2 rounded-md hover:bg-ink/5 transition-colors focus:outline-none">
            <MoreVertical className="h-4 w-4 text-ink/70" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end" className="w-40 font-body bg-parchment border-ink/20 shadow-lg">
            <DropdownMenuItem onClick={() => navigate(`/dashboard/resume/${resumeId}/edit`)} className="cursor-pointer hover:bg-ink/5 focus:bg-ink/5">
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/my-resume/${resumeId}/view`)} className="cursor-pointer hover:bg-ink/5 focus:bg-ink/5">
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)} className="cursor-pointer text-destructive hover:bg-destructive/10 focus:bg-destructive/10">
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <AlertDialog open={openAlert}>
          <AlertDialogContent className="font-body bg-parchment border-ink/20 shadow-xl">
            <AlertDialogHeader>
              <AlertDialogTitle className="font-display font-bold text-ink">Are you sure?</AlertDialogTitle>
              <AlertDialogDescription className="text-ink/70">
                This will permanently delete your resume from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)} className="border-ink/20 hover:bg-ink/5">
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
