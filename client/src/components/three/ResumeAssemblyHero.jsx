import React, { useState, useEffect, Suspense, lazy } from 'react';
import ResumeAssemblyFallback from './ResumeAssemblyFallback';

const ResumeAssemblyScene = lazy(() => import('./ResumeAssemblyScene'));

const isWebGLAvailable = () => {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
};

export default function ResumeAssemblyHero() {
  const [shouldRender3D, setShouldRender3D] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
    
    // Feature detect to see if we should render 3D
    const isDesktop = window.innerWidth >= 768;
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hasWebGL = isWebGLAvailable();

    if (isDesktop && !prefersReducedMotion && hasWebGL) {
      setShouldRender3D(true);
    }
  }, []);

  if (!isMounted) return null;

  return (
    <div className="relative w-full h-[400px] md:h-[600px] flex items-center justify-center overflow-hidden">
      {shouldRender3D ? (
        <Suspense fallback={<ResumeAssemblyFallback />}>
          <div className="absolute inset-0 w-full h-full z-10 pointer-events-none">
            <ResumeAssemblyScene />
          </div>
        </Suspense>
      ) : (
        <ResumeAssemblyFallback />
      )}
    </div>
  );
}
