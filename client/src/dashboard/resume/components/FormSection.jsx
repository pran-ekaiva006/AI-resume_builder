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
import { motion, AnimatePresence } from 'framer-motion';

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
    <div className="p-5 shadow-lg rounded-lg border-t-brass border-t-4 mt-10 bg-surface">
      <h2 className="font-display font-bold text-lg mb-1 text-ink">Share Resume</h2>
      <p className="font-body text-sm text-ink/70 mb-5">
        A public link lets anyone with the URL view your resume — great for recruiters and
        online applications. Your resume is <strong>private by default</strong>.
      </p>

      {/* Toggle */}
      <div className="flex items-center justify-between p-4 rounded-lg border border-ink/10 bg-parchment">
        <div className="flex items-center gap-3">
          {isPublic
            ? <Globe className="h-5 w-5 text-teal" />
            : <Lock className="h-5 w-5 text-ink/40" />}
          <div>
            <p className="font-body font-medium text-sm text-ink">
              {isPublic ? 'Public — anyone with the link can view' : 'Private — only you can view'}
            </p>
            <p className="font-body text-xs text-ink/50 mt-0.5">
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
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-brass
            ${isPublic ? 'bg-teal' : 'bg-ink/20'}
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
          <p className="font-mono text-xs font-semibold text-ink/60 uppercase tracking-wide mb-2">
            Public link
          </p>
          <div className="flex items-center gap-2 p-3 rounded-md border border-ink/10 bg-white text-sm break-all">
            <span className="flex-1 font-body text-ink/80 text-xs">{publicUrl}</span>
            <button
              id="copy-public-url"
              aria-label="Copy public URL"
              onClick={handleCopy}
              className="flex-shrink-0 p-1 rounded hover:bg-ink/5 transition-colors"
            >
              {copied
                ? <Check className="h-4 w-4 text-teal" />
                : <Copy className="h-4 w-4 text-ink/40" />}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const STEPS = [
  { id: 1, label: 'Personal' },
  { id: 2, label: 'Summary' },
  { id: 3, label: 'Experience' },
  { id: 4, label: 'Education' },
  { id: 5, label: 'Skills' },
  { id: 6, label: 'Share' }
];

function FormSection() {
  const [activeFormIndex, setActiveFormIndex] = useState(1);
  const [enableNext, setEnableNext] = useState(true);
  const { resumeId } = useParams();

  return (
    <div className="flex flex-col">
      {/* Header Controls */}
      <div className='flex justify-between items-center bg-white/50 p-2 rounded-lg mb-4'>
        <div className='flex gap-5'>
          <Link to={"/dashboard"}>
            <Button variant="outline" className="border-ink/20 text-ink hover:bg-ink/5">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className='flex gap-2'>
          {activeFormIndex > 1 && (
            <Button 
              size="sm"
              variant="outline"
              className="border-ink/20 text-ink hover:bg-ink/5"
              onClick={() => setActiveFormIndex(activeFormIndex - 1)}
            > 
              <ArrowLeft className="h-4 w-4" /> 
            </Button>
          )}
          <Button
            disabled={!enableNext}
            className="flex gap-2 bg-brass hover:bg-brass/90 text-ink font-semibold" 
            size="sm"
            onClick={() => setActiveFormIndex(activeFormIndex + 1)}
          > 
            Next
            <ArrowRight className="h-4 w-4" /> 
          </Button>
        </div>
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-between mb-8 overflow-x-auto pb-2 px-2">
        {STEPS.map((step, index) => {
          const isActive = activeFormIndex === step.id;
          const isCompleted = activeFormIndex > step.id;
          return (
            <div key={step.id} className="flex items-center min-w-max">
              <div className="flex flex-col items-center gap-1.5">
                <div 
                  className={`w-7 h-7 rounded-full flex items-center justify-center font-mono text-sm font-bold transition-colors duration-300 ${
                    isActive ? 'bg-brass text-ink border-2 border-brass' : 
                    isCompleted ? 'bg-teal text-ink border-2 border-teal' : 
                    'bg-transparent border-2 border-ink/20 text-ink/40'
                  }`}
                >
                  {isCompleted ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : step.id}
                </div>
                <span className={`font-mono text-[9px] uppercase tracking-wider transition-colors duration-300 ${
                  isActive ? 'text-brass font-bold' : 
                  isCompleted ? 'text-teal font-semibold' : 
                  'text-ink/40 font-medium'
                }`}>
                  {step.label}
                </span>
              </div>
              {index < STEPS.length - 1 && (
                <div className={`w-4 sm:w-8 md:w-12 h-[2px] mx-1 sm:mx-2 transition-colors duration-300 rounded-full ${
                  isCompleted ? 'bg-teal' : 'bg-ink/10'
                }`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Form Content with Transitions */}
      <div className="relative overflow-visible">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeFormIndex}
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -16 }}
            transition={{ duration: 0.2, ease: "linear" }} // ~200ms, no bounce (linear or easeOut)
          >
            {activeFormIndex == 1 && <PersonalDetail enabledNext={(v) => setEnableNext(v)} />}
            {activeFormIndex == 2 && <Summery enabledNext={(v) => setEnableNext(v)} />}
            {activeFormIndex == 3 && <Experience />}
            {activeFormIndex == 4 && <Education />}
            {activeFormIndex == 5 && <Skills />}
            {activeFormIndex == 6 && <SharePanel />}
            {activeFormIndex == 7 && <Navigate to={'/my-resume/' + resumeId + "/view"} />}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}

export default FormSection