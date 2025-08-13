import React from 'react';

function ExperiencePreview({ resumeInfo }) {
  return (
    <div className='my-6'>
      <h2
        className='text-center font-bold text-sm mb-2'
        style={{ color: resumeInfo?.themeColor }}
      >
        Professional Experience
      </h2>
      <hr style={{ borderColor: resumeInfo?.themeColor }} />

      {resumeInfo?.experience.map((experience, index) => (
        <div key={index}>
          <h2 className='text-sm font-bold'>{experience?.title}</h2>
          <h2 className='text-xs flex justify-between'>
            {experience?.companyName}, {experience?.city}, {experience?.state}
            <span>
              {experience?.startDate} To{' '}
              {experience?.currentWorking ? 'Present' : experience.endDate}
            </span>
          </h2>
          <div
            className='text-xs my-2'
            dangerouslySetInnerHTML={{ __html: experience?.workSummery }}
          />
        </div>
      ))}
    </div>
  );
}

export default ExperiencePreview;