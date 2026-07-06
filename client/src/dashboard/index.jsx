import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import { useAuth } from "../context/AuthContext";
import { useApiClient } from "../../service/GlobalApi";

function Dashboard() {
  const { user, loading } = useAuth();
  const { GetUserResumes } = useApiClient();

  const [resumeList, setResumeList] = useState([]);
  const [loadingResumes, setLoadingResumes] = useState(true);

  useEffect(() => {
    if (user && !loading) {
      fetchResumes();
    }
  }, [user, loading]);

  const fetchResumes = async () => {
    try {
      setLoadingResumes(true);
      const data = await GetUserResumes();
      setResumeList(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);
      setResumeList([]);
    } finally {
      setLoadingResumes(false);
    }
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.firstName) return user.firstName[0].toUpperCase();
    if (user?.email) return user.email[0].toUpperCase();
    return 'U';
  };

  const publicCount = resumeList.filter(r => r?.isPublic).length;
  const memberSince = user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Unknown';
  
  const displayEmail = user?.email?.endsWith('@demo.local') ? 'demo@demo.local' : user?.email;

  if (loading) {
    return (
      <div className="min-h-[calc(100vh-80px)] bg-ink text-text-on-dark flex items-center justify-center">
        <div className="animate-pulse font-body text-text-on-dark/60">Loading…</div>
      </div>
    );
  }

  const hasResumes = !loadingResumes && resumeList.length > 0;

  return (
    <div className="min-h-[calc(100vh-80px)] bg-ink text-text-on-dark p-6 md:p-10 lg:px-32 flex flex-col gap-10">
      
      {/* SECTION 1: Profile Panel — always visible */}
      <section className="bg-surface rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center md:items-start gap-6 border border-white/5 shadow-2xl">
        {/* Avatar */}
        <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 rounded-full bg-teal flex items-center justify-center text-text-on-light font-display font-bold text-3xl md:text-4xl shadow-inner">
          {getInitials()}
        </div>
        
        {/* User Info */}
        <div className="flex flex-col items-center md:items-start flex-1 text-center md:text-left mt-2 md:mt-0">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-text-on-dark tracking-tight">
            {user?.firstName} {user?.lastName}
          </h2>
          <p className="font-body text-text-on-dark/70 mt-1">{displayEmail}</p>
        </div>

        {/* Stats */}
        <div className="flex gap-4 sm:gap-8 mt-6 md:mt-2 w-full md:w-auto justify-center md:justify-end">
          <div className="flex flex-col items-center md:items-end">
            <span className="text-2xl font-semibold text-brass font-sans">{resumeList.length}</span>
            <span className="font-mono text-xs text-text-on-dark/50 uppercase tracking-wider mt-1">Resumes</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center md:items-end">
            <span className="text-2xl font-semibold text-teal font-sans">{publicCount}</span>
            <span className="font-mono text-xs text-text-on-dark/50 uppercase tracking-wider mt-1">Public</span>
          </div>
          <div className="w-px bg-white/10" />
          <div className="flex flex-col items-center md:items-end">
            <span className="font-mono text-base md:text-lg font-semibold text-text-on-dark mt-1 md:mt-0">{memberSince}</span>
            <span className="font-mono text-xs text-text-on-dark/50 uppercase tracking-wider mt-2 md:mt-1">Member Since</span>
          </div>
        </div>
      </section>

      {/* SECTION 2: Resumes Panel */}
      <section>
        <h2 className="font-display font-bold text-3xl tracking-tight text-text-on-dark">My Workspace</h2>
        <p className="font-body text-text-on-dark/70 mt-2">Start creating an AI-powered resume for your next job role.</p>

        {/* Loading state */}
        {loadingResumes && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            {[1, 2, 3, 4].map((item, index) => (
              <div
                key={index}
                className="h-[280px] rounded-lg bg-surface/50 border border-ink/20 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Has resumes — normal grid */}
        {hasResumes && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-8">
            <AddResume refreshData={fetchResumes} />
            {resumeList.map((resume, index) => (
              <ResumeCardItem
                key={resume._id || index}
                resume={resume}
                refreshData={fetchResumes}
              />
            ))}
          </div>
        )}

        {/* Empty state — single centered composition */}
        {!loadingResumes && resumeList.length === 0 && (
          <div className="flex flex-col items-center justify-start mt-12 mb-8">
            {/* Caption */}
            <p className="font-body text-lg text-text-on-dark/60 mt-4 mb-8">
              Your first resume starts here
            </p>

            {/* Create New action */}
            <div className="w-56">
              <AddResume refreshData={fetchResumes} />
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

export default Dashboard;

