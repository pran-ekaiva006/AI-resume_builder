import React from 'react';
import { motion } from 'framer-motion';

export default function ResumeAssemblyFallback() {
  const panels = [
    { text: "Header", yOffset: -60, rotation: -3, xOffset: -10 },
    { text: "Experience", yOffset: -20, rotation: 2, xOffset: 5 },
    { text: "Education", yOffset: 20, rotation: -2, xOffset: -5 },
    { text: "Skills", yOffset: 60, rotation: 3, xOffset: 8 },
  ];
  
  return (
    <div className="w-full h-full flex items-center justify-center relative p-8 min-h-[350px]">
      {panels.map((panel, i) => (
        <motion.div
          key={panel.text}
          initial={{ opacity: 0, y: 100, x: -20, rotate: panel.rotation * 3 }}
          animate={{ opacity: 1, y: panel.yOffset, x: panel.xOffset, rotate: panel.rotation }}
          transition={{ delay: i * 0.15, duration: 0.7, type: "spring", stiffness: 90 }}
          className="absolute w-56 sm:w-72 h-20 sm:h-24 bg-parchment border-2 border-ink rounded-lg shadow-[4px_4px_0_var(--ink),8px_8px_0_rgba(16,19,28,0.15)] flex items-center justify-center"
          style={{ zIndex: i }}
        >
          <span className="font-mono text-ink font-semibold">{panel.text}</span>
        </motion.div>
      ))}
    </div>
  );
}
