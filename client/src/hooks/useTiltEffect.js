import { useEffect, useRef } from 'react';

export function useTiltEffect(options = {}) {
  const { maxAngle = 6, scale = 1.02 } = options;
  const ref = useRef(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Feature detect touch devices
    const isHoverable = window.matchMedia('(hover: hover)').matches;
    if (!isHoverable) return;

    const handleMouseMove = (e) => {
      const rect = element.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate rotation based on cursor position relative to center
      const rotateX = ((y - centerY) / centerY) * -maxAngle;
      const rotateY = ((x - centerX) / centerX) * maxAngle;

      element.style.transform = `perspective(1000px) scale(${scale}) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      element.style.transition = 'transform 0.1s ease-out';
      element.style.zIndex = '10'; // Elevate slightly while interacting
    };

    const handleMouseLeave = () => {
      element.style.transform = 'perspective(1000px) scale(1) rotateX(0deg) rotateY(0deg)';
      element.style.transition = 'transform 0.5s cubic-bezier(0.2, 0.8, 0.2, 1)';
      element.style.zIndex = '1';
    };

    element.addEventListener('mousemove', handleMouseMove);
    element.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      element.removeEventListener('mousemove', handleMouseMove);
      element.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [maxAngle, scale]);

  return ref;
}
