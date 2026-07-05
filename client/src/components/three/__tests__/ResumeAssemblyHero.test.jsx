import React from 'react';
import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, afterEach } from 'vitest';
import ResumeAssemblyHero from '../ResumeAssemblyHero';
import '@testing-library/jest-dom';

describe('ResumeAssemblyHero', () => {
  let originalMatchMedia;
  let originalInnerWidth;

  beforeEach(() => {
    originalMatchMedia = window.matchMedia;
    originalInnerWidth = window.innerWidth;
    window.innerWidth = 1024; // Desktop width by default
  });

  afterEach(() => {
    window.matchMedia = originalMatchMedia;
    window.innerWidth = originalInnerWidth;
    vi.restoreAllMocks();
  });

  it('renders fallback when prefers-reduced-motion is true', () => {
    window.matchMedia = vi.fn().mockImplementation(query => ({
      matches: query === '(prefers-reduced-motion: reduce)',
      media: query,
      onchange: null,
      addListener: vi.fn(),
      removeListener: vi.fn(),
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
      dispatchEvent: vi.fn(),
    }));

    render(<ResumeAssemblyHero />);
    
    // Should render the fallback components instead of the Canvas
    expect(screen.getByText('Header')).toBeInTheDocument();
    expect(screen.getByText('Experience')).toBeInTheDocument();
    expect(screen.getByText('Education')).toBeInTheDocument();
    expect(screen.getByText('Skills')).toBeInTheDocument();
  });
});
