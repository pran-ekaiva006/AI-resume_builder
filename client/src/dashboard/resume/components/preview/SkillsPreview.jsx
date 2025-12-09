// client/src/dashboard/resume/components/preview/SkillsPreview.jsx

import React from "react";

function SkillsPreview({ resumeInfo }) {
  const skills = Array.isArray(resumeInfo?.skills) ? resumeInfo.skills : [];
  const themeColor = resumeInfo?.themeColor || "#000";

  return (
    <div className="my-6">
      <h2 className="text-center font-bold text-sm mb-2" style={{ color: themeColor }}>
        Skills
      </h2>
      <hr style={{ borderColor: themeColor }} />

      <div className="grid grid-cols-2 gap-3 my-4">
        {skills.length > 0 ? (
          skills.map((skill, index) => (
            <div key={index} className="flex items-center justify-between">
              <h2 className="text-xs">{skill?.name || "Skill"}</h2>

              {/* Progress bar */}
              <div className="h-2 bg-gray-200 w-[120px] rounded">
                <div
                  className="h-2 rounded"
                  style={{
                    backgroundColor: themeColor,
                    width: `${skill?.rating || 0}%`, // ✅ rating is already 0-100
                  }}
                />
              </div>
            </div>
          ))
        ) : (
          <p className="text-xs text-gray-400 italic mt-2 text-center col-span-2">
            No skills added yet.
          </p>
        )}
      </div>
    </div>
  );
}

export default SkillsPreview;
