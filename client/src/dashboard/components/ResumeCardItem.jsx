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

function ResumeCardItem({ resume, refreshData }) {
  const navigate = useNavigate();
  const [openAlert, setOpenAlert] = useState(false);
  const [loading, setLoading] = useState(false);

  const { DeleteResumeById } = useApiClient();

  const onDelete = async () => {
    try {
      setLoading(true);
      await DeleteResumeById(resume.documentId || resume.resumeId);
      toast.success('Resume deleted successfully!');
      refreshData();
    } catch (error) {
      console.error("❌ Failed to delete resume:", error);
      toast.error('Failed to delete resume');
    } finally {
      setLoading(false);
      setOpenAlert(false);
    }
  };

  // ✅ Safe data handling
  const resumeTitle = resume?.title?.trim() || "Untitled Resume";
  const themeColor = resume?.themeColor || "#ff6666";
  const createdAt = resume?.createdAt
    ? new Date(resume.createdAt).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })
    : "Recently Created";

  const resumeId = resume?.documentId || resume?.resumeId;

  return (
    <div className="group relative transition-all hover:scale-[1.03] hover:shadow-md">
      <Link to={`/dashboard/resume/${resumeId}/edit`}>
        <div
          className="p-14 bg-gradient-to-b from-pink-100 via-purple-200 to-blue-200 h-[260px] rounded-t-lg border-t-4 flex items-center justify-center"
          style={{ borderColor: themeColor }}
        >
          <img src="/cv.png" width={70} height={70} alt="Resume Icon" />
        </div>
      </Link>

      <div
        className="border p-3 flex justify-between items-center text-white rounded-b-lg"
        style={{ background: themeColor }}
      >
        <div>
          <h2 className="text-sm font-semibold truncate w-[110px]">
            {resumeTitle}
          </h2>
          <p className="text-[11px] opacity-90">{createdAt}</p>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger>
            <MoreVertical className="h-4 w-4 cursor-pointer hover:opacity-80" />
          </DropdownMenuTrigger>

          <DropdownMenuContent>
            <DropdownMenuItem onClick={() => navigate(`/dashboard/resume/${resumeId}/edit`)}>
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => navigate(`/my-resume/${resumeId}/view`)}>
              View
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => setOpenAlert(true)}>
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Delete Confirmation Dialog */}
        <AlertDialog open={openAlert}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete your resume from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => setOpenAlert(false)}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction onClick={onDelete} disabled={loading}>
                {loading ? <Loader2Icon className="animate-spin" /> : 'Delete'}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}

export default ResumeCardItem;
