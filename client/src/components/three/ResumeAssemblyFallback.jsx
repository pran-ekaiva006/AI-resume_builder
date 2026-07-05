import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeAssemblyFallback() {
  const panels = ["Header", "Experience", "Education", "Skills"];
  
  return (
    <div className="w-full h-full flex flex-col items-center justify-center relative p-8">
      {panels.map((text, i) => (
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.15, duration: 0.5 }}
          className="w-48 sm:w-64 h-16 sm:h-20 bg-parchment border-2 border-ink rounded-lg shadow-sm flex items-center justify-center my-1"
          style={{ zIndex: i }}
        >
          <span className="font-mono text-ink font-semibold">{text}</span>
        </motion.div>
      ))}
    </div>
  );
}
