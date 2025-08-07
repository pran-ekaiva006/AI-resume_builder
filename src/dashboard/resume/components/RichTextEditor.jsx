import { Button } from '@/components/ui/button';
import { ResumeInfoContext } from '@/context/ResumeInfoContext';
import { Brain, LoaderCircle } from 'lucide-react';
import React, { useContext, useState } from 'react'
import {
  BtnBold,
  BtnBulletList,
  BtnClearFormatting,
  BtnItalic,
  BtnLink,
  BtnNumberedList,
  BtnStrikeThrough,
  BtnStyles,
  BtnUnderline,
  Editor,
  EditorProvider,
  HtmlButton,
  Separator,
  Toolbar
} from 'react-simple-wysiwyg';
import { AIchatSession } from './../../../../service/AIModal';
import { toast } from 'sonner';

const PROMPT = 'position title: {positionTitle}, based on this title give me 5-7 bullet points for my experience in resume. Do NOT include experience level. Do NOT return JSON. Give the result in valid HTML <ul><li> format only.';

function RichTextEditor({ onRichTextEditorChange, index, defaultValue }) {
  const [value, setValue] = useState(defaultValue);
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const [loading, setLoading] = useState(false);

  const GenerateSummeryFromAI = async () => {
    try {
      const positionTitle = resumeInfo?.experience[index]?.title;

      if (!positionTitle) {
        toast.error('Please add Position Title first');
        return;
      }

      setLoading(true);
      const prompt = PROMPT.replace('{positionTitle}', positionTitle);

      // Pass format explicitly as 'html'
      const result = await AIchatSession.sendMessage(prompt, { format: "html" });
      const content = await result.response.text();

      setValue(content);
      onRichTextEditorChange({ target: { value: content } });
      toast.success('Content generated successfully!');
    } catch (error) {
      console.error("AI Generation Error:", error);
      toast.error(error.message || "Failed to generate content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className='flex justify-between my-2'>
        <label className='text-xs'>Summary</label>
        <Button
          variant="outline"
          size="sm"
          onClick={GenerateSummeryFromAI}
          disabled={loading}
          className="flex gap-2 border-primary text-primary"
        >
          {loading ? (
            <LoaderCircle className='animate-spin' />
          ) : (
            <>
              <Brain className='h-4 w-4' /> Generate from AI
            </>
          )}
        </Button>
      </div>
      <EditorProvider>
        <Editor
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            onRichTextEditorChange(e);
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