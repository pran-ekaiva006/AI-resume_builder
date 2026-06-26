// client/src/dashboard/resume/components/preview/EducationalPreview.jsx

import React from "react";

function EducationalPreview({ resumeInfo }) {
  const educationList = Array.isArray(resumeInfo?.education)
    ? resumeInfo.education
    : [];
  const themeColor = resumeInfo?.themeColor || "#000";

  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color: themeColor }}>
        Education
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {educationList.length > 0 ? (
        educationList.map((education, index) => {
          const formatDate = (dateStr) => {
            if (!dateStr) return "—";
            const date = new Date(dateStr);
            if (isNaN(date.getTime())) return dateStr;
            return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
          };

          return (
            <div key={index} className="my-5">
              <h2 className="text-sm font-bold" style={{ color: themeColor }}>
                {education?.universityName || "University Name"}
              </h2>

              <h2 className="text-xs flex justify-between">
                {(education?.degree || "Degree") +
                  (education?.major ? ` in ${education?.major}` : "")}

                <span>
                  {formatDate(education?.startDate)} -{" "}
                  {formatDate(education?.endDate)}
                </span>
              </h2>

            <p className="text-xs my-2 whitespace-pre-line">
              {education?.description || "No description available."}
            </p>
          </div>
        );
      })
      ) : (
        <p className="text-xs text-gray-400 italic mt-2 text-center">
          No education added yet.
        </p>
      )}
    </div>
  );
}

export default EducationalPreview;
