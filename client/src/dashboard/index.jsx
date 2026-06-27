import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import { useAuth } from "../context/AuthContext";
import { useApiClient } from "../../service/GlobalApi"; // ✅ correct import

function Dashboard() {
  const { user, loading } = useAuth();
  const { GetUserResumes } = useApiClient();

  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user && !loading) {

      fetchResumes();
    }
  }, [user, loading]);

  // ✅ Fetch resumes from backend
  const fetchResumes = async () => {
    try {
      const data = await GetUserResumes();

      setResumeList(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);
      setResumeList([]);
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating an AI-powered resume for your next job role.</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        {/* ✅ Pass refreshData to AddResume */}
        <AddResume refreshData={fetchResumes} />

        {resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              key={resume._id || index}
              resume={resume}
              refreshData={fetchResumes}
            />
          ))
        ) : (
          // Loading placeholders
          [1, 2, 3, 4].map((item, index) => (
            <div
              key={index}
              className="h-[280px] rounded-lg bg-slate-200 animate-pulse"
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Dashboard;
