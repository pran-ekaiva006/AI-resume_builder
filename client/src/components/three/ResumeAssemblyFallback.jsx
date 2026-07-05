import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeAssemblyFallback() {
  const panels = [
    { text: "Header", yOffset: -85, rotation: -4, xOffset: -15, delay: 0 },
    { text: "Experience", yOffset: -25, rotation: 2, xOffset: 8, delay: 0.15 },
    { text: "Education", yOffset: 35, rotation: -2, xOffset: -5, delay: 0.3 },
    { text: "Skills", yOffset: 95, rotation: 3, xOffset: 12, delay: 0.45 },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center relative p-8 min-h-[450px]">
      {panels.map((panel, i) => (
        <motion.div
          key={panel.text}
          initial={{ opacity: 0, y: 150, x: -30, rotate: panel.rotation * 4 }}
          animate={{ opacity: 1, y: panel.yOffset, x: panel.xOffset, rotate: panel.rotation }}
          transition={{ delay: panel.delay, duration: 0.8, type: "spring", stiffness: 80 }}
          className="absolute w-64 sm:w-80 bg-parchment border border-ink/20 rounded-lg shadow-[4px_4px_0_var(--ink),8px_8px_0_rgba(16,19,28,0.1)] flex flex-col p-4 sm:p-5"
          style={{ zIndex: i }}
        >
          {/* Header/Label at top so it's not covered by overlap */}
          <div className="flex justify-between items-start mb-3">
            <span className="font-mono text-ink font-bold tracking-tight text-sm uppercase">{panel.text}</span>
            <div className="flex gap-1 mt-1">
              <div className="w-1.5 h-1.5 rounded-full bg-brass"></div>
              <div className="w-1.5 h-1.5 rounded-full bg-teal"></div>
            </div>
          </div>
          
          <div className="h-px w-full bg-ink/10 mb-3"></div>

          {/* Skeleton UI below */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-ink/10 flex-shrink-0"></div>
            <div className="flex-1">
              <div className="h-3 bg-ink/20 rounded w-2/3 mb-2"></div>
              <div className="h-2 bg-ink/10 rounded w-1/3"></div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
