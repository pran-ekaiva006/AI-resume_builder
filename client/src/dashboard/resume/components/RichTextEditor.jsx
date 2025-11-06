import { Button } from 'client/src/components/ui/button';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react';
import {
  BtnBold,
  BtnBulletList,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnUnderline,
  Editor,
  EditorProvider,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import axios from "axios";
import { toast } from 'sonner';

const PROMPT = `
Based on this job role: "{positionTitle}", generate 5-7 resume bullet points.
Return ONLY HTML <ul><li>...</li></ul>. No markdown. No JSON.
`;

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue || "");
  const { resumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const GenerateSummeryFromAI = async () => {
    const positionTitle = resumeInfo?.experience[index]?.title;

    if (!positionTitle) {
      toast.error("Please enter Position Title first ⚠️");
      return;
    }

    setLoading(true);
    try {
      const finalPrompt = PROMPT.replace("{positionTitle}", positionTitle);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/generate`,
        { prompt: finalPrompt, format: "html" },
        { withCredentials: true }
      );

      const content = response.data.content;

      setValue(content);
      onRichTextEditorChange(content);   // ✅ send string ONLY

      toast.success("✨ AI content generated!");
    } catch (error) {
      console.error("AI Error:", error);
      toast.error("Failed to generate content ❌");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Work Summary</label>

        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? <LoaderCircle className='animate-spin' /> :
            <>
              <Brain className='h-4 w-4' /> Generate from AI
            </>
          }
        </Button>
      </div>

      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e.target.value);  // ✅ send string ONLY
          }}
        >
          <Toolbar>
            <BtnBold />
            <BtnItalic />
            <BtnUnderline />
            <BtnStrikeThrough />
            <Separator />
            <BtnNumberedList />
            <BtnBulletList />
            <Separator />
            <BtnLink />
          </Toolbar>
        </Editor>
      </EditorProvider>
    </div>
  );
}

export default RichTextEditor;
