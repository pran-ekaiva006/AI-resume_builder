import React from 'react';

function ExperiencePreview({ resumeInfo }) {
  const experienceList = Array.isArray(resumeInfo?.experience)
    ? resumeInfo.experience
    : [];
  const themeColor = resumeInfo?.themeColor || '#000';

  return (
    <div className="my-6">
      <h2
        className="text-center font-bold text-sm mb-2"
        style={{ color: themeColor }}
      >
        Experience
      </h2>
      <hr style={{ borderColor: themeColor }} />

      {experienceList.length > 0 ? (
        experienceList.map((exp, index) => (
          <div key={index} className="my-5">
            <h2 className="text-sm font-bold" style={{ color: themeColor }}>
              {exp?.title || 'Job Title'}
            </h2>
            <h2 className="text-xs flex justify-between">
              {exp?.companyName || 'Company Name'}, {exp?.city || 'City'}{' '}
              {exp?.state || ''}
              <span>
                {exp?.startDate || '—'} - {exp?.endDate || 'Present'}
              </span>
            </h2>
            <p className="text-xs my-2 whitespace-pre-line">
              {exp?.workSummery || 'No work summary available.'}
            </p>
          </div>
        ))
      ) : (
        <p className="text-xs text-gray-400 italic mt-2 text-center">
          No experience data available.
        </p>
      )}
    </div>
  );
}

export default ExperiencePreview;
