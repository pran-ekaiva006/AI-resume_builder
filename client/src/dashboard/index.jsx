import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import { useAuth } from "../context/AuthContext";
import { useApiClient } from "../../service/GlobalApi";
import ResumeAssemblyFallback from "../components/three/ResumeAssemblyFallback";

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

  return (
    <div className="min-h-[calc(100vh-80px)] bg-ink text-text-on-dark p-10 md:px-20 lg:px-32">
      <h2 className="font-display font-bold text-4xl tracking-tight">My Workspace</h2>
      <p className="font-body text-text-on-dark/80 mt-2">Start creating an AI-powered resume for your next job role.</p>

      {/* Grid container for cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mt-10">
        <AddResume refreshData={fetchResumes} />

        {loadingResumes ? (
          // Loading placeholders
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-surface/50 border border-ink/20 animate-pulse"
            />
          ))
        ) : resumeList.length > 0 ? (
          // Resume cards
          resumeList.map((resume, index) => (
            <ResumeCardItem
              key={resume._id || index}
              resume={resume}
              refreshData={fetchResumes}
            />
          ))
        ) : null}
      </div>

      {/* Empty State Illustration */}
      {!loadingResumes && resumeList.length === 0 && (
        <div className="mt-16 flex flex-col items-center justify-center opacity-80 pointer-events-none">
          <div className="transform scale-[0.6] -mt-16 -mb-20">
            <ResumeAssemblyFallback />
          </div>
          <p className="font-body text-lg text-text-on-dark/60 mt-4">Your first resume starts here</p>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
