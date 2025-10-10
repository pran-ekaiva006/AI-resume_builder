import { Button } from 'client/src/components/ui/button';
import { Textarea } from 'client/src/components/ui/textarea';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useApiClient } from '../../../../../service/GlobalApi'; // ✅ updated import
import { AIchatSession } from '../../../../../service/AIModal';

const prompt = `Generate 3 professional resume summaries for a {jobTitle} position at different experience levels.
IMPORTANT: Respond ONLY with a JSON array in this EXACT format, no other text:
[
  {
    "experience_level": "Mid Level",
    "summary": "4+ years experience..."
  },
  {
    "experience_level": "Entry Level",
    "summary": "2 years experience..."
  },
  {
    "experience_level": "Fresher Level",
    "summary": "Recent graduate..."
  }
] JSON array`;

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo?.summery || '');
  const [loading, setLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  // ✅ get secured API client functions
  const { UpdateResumeDetail } = useApiClient();

  useEffect(() => {
    if (summery) {
      setResumeInfo((prev) => ({ ...prev, summery }));
    }
  }, [summery, setResumeInfo]);

  // ✅ Generate suggestions using AI model
  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    try {
      const PROMPT = prompt.replace('{jobTitle}', resumeInfo?.jobTitle || '');
      const result = await AIchatSession.sendMessage(PROMPT, { format: 'json' });
      const rawText = await result.response.text();

      const match = rawText.match(/\[[\s\S]*\]/);
      const jsonText = match ? match[0] : rawText;
      const parsed = JSON.parse(jsonText);

      if (Array.isArray(parsed) && parsed.every((i) => i.experience_level && i.summary)) {
        setAiGenerateSummeryList(parsed);
        toast.success('✨ AI suggestions generated!');
      } else {
        throw new Error('Invalid response format');
      }
    } catch (error) {
      console.error('AI Error:', error);
      toast.error('Failed to generate suggestions');
    } finally {
      setLoading(false);
    }
  };

  // ✅ Save summary details to backend
  const onSave = async (e) => {
    e.preventDefault();
    setLoading(true);

    const dataToSave = {
      ...resumeInfo,
      summery: summery || resumeInfo?.summery || '',
      resumeId: resumeInfo?.resumeId,
    };

    if (!dataToSave.resumeId) {
      toast.error('❌ Resume ID missing. Cannot save.');
      setLoading(false);
      return;
    }

    try {
      await UpdateResumeDetail(dataToSave.resumeId, dataToSave);
      toast.success('✅ Summary saved!');
      enabledNext(true);
    } catch (error) {
      console.error('❌ Failed to save summary:', error);
      toast.error('Error saving summary ❌');
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
              className='border-primary text-primary flex gap-2'
            >
              <Brain className='h-4 w-4' /> Generate from AI
            </Button>
          </div>
          <Textarea
            className='mt-5'
            required
            value={summery}
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
              className='p-5 shadow-lg my-4 rounded-lg cursor-pointer'
            >
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
