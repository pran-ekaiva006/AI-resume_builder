import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import PersonalDetail from './forms/PersonalDetail';
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import { ArrowLeft, ArrowRight, LayoutGrid } from 'lucide-react';

function FormSection({ resumeId }) {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(false);

  return (
    <div>
      <div className='flex justify-between items-center'>
        <Button variant="outline" size="sm" className="flex gap-2">
          <LayoutGrid /> Theme
        </Button>
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button size="sm" onClick={() => setActiveFormIndex(activeFormIndex - 1)}>
              <ArrowLeft />
            </Button>
          )}
          <Button
            disabled={!enableNext}
            className='flex gap-2'
            size='sm'
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          >
            Next <ArrowRight />
          </Button>
        </div>
      </div>

      {activeFormIndex === 1 && <PersonalDetail enabledNext={setEnableNext} resumeId={resumeId} />}
      {activeFormIndex === 2 && <Summery enabledNext={setEnableNext} resumeId={resumeId} />}
      {activeFormIndex === 3 && <Experience enabledNext={setEnableNext} resumeId={resumeId} />}
      {activeFormIndex === 4 && <Education enabledNext={setEnableNext} resumeId={resumeId} />}
    </div>
  );
}

export default FormSection;