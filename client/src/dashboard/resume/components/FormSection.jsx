import React, { useContext, useState } from 'react'
import PersonalDetail from './forms/PersonalDetail'
import { Button } from 'client/src/components/ui/button'
import { ArrowLeft, ArrowRight, Home, Globe, Lock, Copy, Check } from 'lucide-react'
import Summery from './forms/Summery';
import Experience from './forms/Experience';
import Education from './forms/Education';
import Skills from './forms/Skills';
import { Link, Navigate, useParams } from 'react-router-dom';
import { ResumeInfoContext } from 'client/src/context/ResumeInfoContext';
import { useApiClient } from '../../../../service/GlobalApi';
import { toast } from 'sonner';
// import ThemeColor from './ThemeColor';

/**
 * SharePanel — step 6 of the form wizard.
 * Lets the owner toggle isPublic and copy the public URL.
 */
function SharePanel() {
  const { resumeId } = useParams();
  const { resumeInfo, setResumeInfo } = useContext(ResumeInfoContext);
  const { UpdateResumeDetail } = useApiClient();
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);

  const isPublic = resumeInfo?.isPublic ?? false;
  const publicUrl = `${window.location.origin}/my-resume/${resumeId}/view`;

  const handleToggle = async () => {
    const next = !isPublic;
    setSaving(true);
    try {
      await UpdateResumeDetail(resumeId, { isPublic: next });
      setResumeInfo((prev) => ({ ...prev, isPublic: next }));
      toast.success(next ? '🌐 Resume is now public' : '🔒 Resume is now private');
    } catch {
      toast.error('Failed to update sharing setting');
    } finally {
      setSaving(false);
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(publicUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="p-5 shadow-lg rounded-lg border-t-primary border-t-4 mt-10">
      <h2 className="font-bold text-lg mb-1">Share Resume</h2>
      <p className="text-sm text-gray-500 mb-5">
        A public link lets anyone with the URL view your resume — great for recruiters and
        online applications. Your resume is <strong>private by default</strong>.
      </p>

      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border bg-gray-50">
        <div className="flex items-center gap-3">
          {isPublic
            ? <Globe className="h-5 w-5 text-green-500" />
            : <Lock className="h-5 w-5 text-gray-400" />}
          <div>
            <p className="font-medium text-sm">
              {isPublic ? 'Public — anyone with the link can view' : 'Private — only you can view'}
            </p>
            <p className="text-xs text-gray-400 mt-0.5">
              {isPublic
                ? 'Toggle off to make it private again.'
                : 'Toggle on to generate a shareable public link.'}
            </p>
          </div>
        </div>

        {/* Toggle switch */}
        <button
          id="isPublic-toggle"
          aria-label={isPublic ? 'Make resume private' : 'Make resume public'}
          disabled={saving}
          onClick={handleToggle}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary
            ${isPublic ? 'bg-green-500' : 'bg-gray-300'}
            ${saving ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform
              ${isPublic ? 'translate-x-6' : 'translate-x-1'}`}
          />
        </button>
      </div>

      {/* Public URL */}
      {isPublic && (
        <div className="mt-4">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2">
            Public link
          </p>
          <div className="flex items-center gap-2 p-3 rounded-md border bg-white text-sm break-all">
            <span className="flex-1 text-gray-700 text-xs">{publicUrl}</span>
            <button
              id="copy-public-url"
              aria-label="Copy public URL"
              onClick={handleCopy}
              className="flex-shrink-0 p-1 rounded hover:bg-gray-100 transition-colors"
            >
              {copied
                ? <Check className="h-4 w-4 text-green-500" />
                : <Copy className="h-4 w-4 text-gray-400" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();
  return (
    <div>
      <div className='flex justify-between items-center'>
        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
            <Button><Home /></Button>
          </Link>
          {/* <ThemeColor/> */}
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1
            && <Button size="sm"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}> <ArrowLeft /> </Button>}
          <Button
            disabled={!enableNext}
            className="flex gap-2" size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          > Next
            <ArrowRight /> </Button>
        </div>
      </div>
      {/* Personal Detail  */}
      {activeFormIndex == 1 ?
        <PersonalDetail enabledNext={(v) => setEnableNext(v)} />
        : activeFormIndex == 2 ?
          <Summery enabledNext={(v) => setEnableNext(v)} />
          : activeFormIndex == 3 ?
            <Experience />
            : activeFormIndex == 4 ?
              <Education />
              : activeFormIndex == 5 ?
                <Skills />
                : activeFormIndex == 6 ?
                  <SharePanel />
                  : activeFormIndex == 7 ?
                    <Navigate to={'/my-resume/' + resumeId + "/view"} />
                    : null
      }


      {/* Experience  */}

      {/* Educational Detail  */}

      {/* Skills  */}

    </div>
  )
}

export default FormSection