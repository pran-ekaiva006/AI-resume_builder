import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import GlobalApi from './../../../../../service/GlobalApi';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { AIchatSession } from './../../../../../service/AIModal';

const prompt = 'Job Title: {jobTitle} , Depends on job title give me list of  summery for 3 experience level, Mid Level and Freasher level in 3 -4 lines in array format, With summery and experience_level Field in JSON Format';

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState('');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);
  const resumeId = resumeInfo?.id;

  useEffect(() => {
    if (summery) {
      setResumeInfo(prev => ({ ...prev, summery }));
    }
  }, [summery]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || '');
    try {
      const result = await AIchatSession.sendMessage(PROMPT);
      const parsed = JSON.parse(await result.response.text());
      setAiGenerateSummeryList(parsed);
    } catch (e) {
      toast.error("AI response parsing failed");
    }
    setLoading(false);
  };

  const onSave = async (e) => {
    e.preventDefault();
    if (!resumeId) {
      toast.error("Resume ID is missing!");
      return;
    }

    setLoading(true);
    const data = { data: { summery } };

    try {
      await GlobalApi.UpdateResumeDetail(resumeId, data);
      enabledNext(true);
      toast.success("Summary updated!");
    } catch (err) {
      toast.error("Failed to update summary");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10'>
        <h2 className='font-bold text-lg'>Summary</h2>
        <p>Add summary for your job title</p>

        <form className='mt-7' onSubmit={onSave}>
          <div className='flex justify-between items-end'>
            <label>Add Summary</label>
            <Button
              variant='outline'
              onClick={GenerateSummeryFromAI}
              type='button'
              size='sm'
              className='border-primary text-primary flex gap-2'>
              <Brain className='h-4 w-4' /> Generate from AI
            </Button>
          </div>
          <Textarea
            className='mt-5'
            required
            value={summery || resumeInfo?.summery || ''}
            onChange={(e) => setSummery(e.target.value)}
          />
          <div className='mt-2 flex justify-end'>
            <Button type='submit' disabled={loading}>
              {loading ? <LoaderCircle className='animate-spin' /> : 'Save'}
            </Button>
          </div>
        </form>
      </div>

      {Array.isArray(aiGeneratedSummeryList) && (
        <div className='my-5'>
          <h2 className='font-bold text-lg'>Suggestions</h2>
          {aiGeneratedSummeryList.map((item, index) => (
            <div
              key={index}
              onClick={() => setSummery(item?.summary)}
              className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'>
              <h2 className='font-bold my-1 text-primary'>
                Level: {item?.experience_level}
              </h2>
              <p>{item?.summary}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Summery;