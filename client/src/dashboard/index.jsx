import React, { useEffect, useState } from "react";
import AddResume from "./components/AddResume";
import ResumeCardItem from "./components/ResumeCardItem";
import { useUser, useAuth } from "@clerk/clerk-react";
import { useApiClient } from "../../service/GlobalApi"; // updated import

function Dashboard() {
  const { user } = useUser();
  const { isLoaded } = useAuth();
  const { GetUserResumes } = useApiClient(); // ✅ now using API client with token

  const [resumeList, setResumeList] = useState([]);

  useEffect(() => {
    if (user && isLoaded) {
      console.log("Fetching resumes for:", user.primaryEmailAddress?.emailAddress);
      fetchResumes();
    }
  }, [user, isLoaded]);

  const fetchResumes = async () => {
    try {
      const data = await GetUserResumes();
      console.log("✅ Response data:", data);
      setResumeList(Array.isArray(data.data) ? data.data : []);
    } catch (error) {
      console.error("❌ Error fetching resumes:", error);
      setResumeList([]);
    }
  };

  return (
    <div className="p-10 md:px-20 lg:px-32">
      <h2 className="font-bold text-3xl">My Resume</h2>
      <p>Start creating an AI resume for your next job role</p>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-5 mt-10">
        <AddResume />
        {resumeList.length > 0 ? (
          resumeList.map((resume, index) => (
            <ResumeCardItem
              resume={resume}
              key={resume._id || index}
              refreshData={fetchResumes}
            />
          ))
        ) : (
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
