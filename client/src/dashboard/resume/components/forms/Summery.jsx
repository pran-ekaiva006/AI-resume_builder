import { Button } from 'client/src/components/ui/button';
import { Textarea } from 'client/src/components/ui/textarea';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import React, { useContext, useEffect, useState } from 'react';
import { Brain, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import axios from "axios";
import { useApiClient } from '../../../../../service/GlobalApi';

const prompt = `Generate 3 professional resume summaries for a {jobTitle} position at different experience levels.
IMPORTANT: Respond ONLY with a JSON array in this EXACT format:
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
]`;

function Summery({ enabledNext }) {
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [summery, setSummery] = useState(resumeInfo?.summery || '');
  const [loading, setLoading] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [aiGeneratedSummeryList, setAiGenerateSummeryList] = useState([]);

  const { UpdateResumeDetail } = useApiClient();

  // ✅ Automatically update context while typing
  useEffect(() => {
    setResumeInfo((prev) => ({ ...prev, summery }));
  }, [summery, setResumeInfo]);

  const GenerateSummeryFromAI = async () => {
    setLoading(true);
    try {
      const PROMPT = prompt.replace("{jobTitle}", resumeInfo?.jobTitle || "");

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
        { prompt: PROMPT, format: "json" },
        { withCredentials: true }
      );

      const raw = response.data.content;
      const match = raw.match(/\[[\s\S]*\]/);
      const parsed = JSON.parse(match ? match[0] : raw);

      setAiGenerateSummeryList(parsed);
      toast.success("✨ AI Summary generated!");
    } catch (error) {
      toast.error("Failed to generate summary ❌");
    } finally {
      setLoading(false);
    }
  };

  const SaveSummary = async () => {
    if (!resumeInfo?.documentId) {
      toast.error("Resume ID missing — cannot save ❌");
      return;
    }

    setSaveLoading(true);
    try {
      await UpdateResumeDetail(resumeInfo.documentId, { summery });
      toast.success("✅ Summary saved successfully!");
    } catch (error) {
      toast.error("Server error — Failed to save summary ❌");
    } finally {
      setSaveLoading(false);
    }
  };

  return (
    <div>
      <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
        <h2 className="font-bold text-lg">Summary</h2>
        <p>Add summary for your job title</p>

        <form className="mt-7">
          <div className="flex justify-between items-end">
            <label>Add Summary</label>
            <Button
              variant="outline"
              onClick={GenerateSummeryFromAI}
              type="button"
              size="sm"
              className="border-primary text-primary flex gap-2"
              disabled={loading}
            >
              {loading ? <LoaderCircle className="animate-spin h-4 w-4" /> : <Brain className="h-4 w-4" />}
              Generate from AI
            </Button>
          </div>

          <Textarea
            className="mt-5"
            required
            value={summery}
            onChange={(e) => setSummery(e.target.value)}
          />
        </form>

        {/* ✅ Save button */}
        <div className="flex justify-end mt-4">
          <Button onClick={SaveSummary} disabled={saveLoading}>
            {saveLoading ? <LoaderCircle className="animate-spin" /> : "Save"}
          </Button>
        </div>
      </div>

      {/* ✅ Display AI options */}
      {aiGeneratedSummeryList.map((item, index) => (
        <div
          key={index}
          onClick={() => setSummery(item.summary)}
          className="p-5 shadow-lg my-4 rounded-lg cursor-pointer hover:bg-gray-50"
        >
          <h2 className="font-bold text-primary">Level: {item.experience_level}</h2>
          <p>{item.summary}</p>
        </div>
      ))}
    </div>
  );
}

export default Summery;
