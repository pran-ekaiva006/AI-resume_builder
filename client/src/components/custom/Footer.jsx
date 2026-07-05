import React from "react";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="bg-ink text-text-on-dark relative overflow-hidden border-t border-white/10 pt-24 pb-12 font-body">
      {/* Decorative large watermark */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[12vw] font-display font-bold text-white/[0.02] pointer-events-none select-none tracking-tighter whitespace-nowrap z-0">
        AI RESUME
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-20">
          {/* Brand/Logo Column */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <Link to="/" className="flex items-center space-x-2 group w-fit focus:outline-none focus:ring-2 focus:ring-brass rounded-md">
              <div className="bg-brass p-2 rounded-xl group-hover:bg-brass/90 transition-colors">
                <FileText className="h-6 w-6 text-ink" />
              </div>
              <span className="text-2xl font-display font-bold text-text-on-dark tracking-tight">
                AI Resume Builder
              </span>
            </Link>
            <p className="text-text-on-dark/60 max-w-sm leading-relaxed text-lg">
              Craft a compelling narrative of your career. Our intelligent formatting engine handles the design while you focus on taking the next step.
            </p>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div className="flex flex-col gap-4">
              <h3 className="font-display font-bold text-lg text-white">Platform</h3>
              <ul className="space-y-3">
                <li><a href="#features" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Features</a></li>
                <li><a href="#how-it-works" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">How it Works</a></li>
                <li><Link to="/auth/sign-in" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Get Started</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-display font-bold text-lg text-white">Resources</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Templates</Link></li>
                <li><Link to="#" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Resume Examples</Link></li>
                <li><Link to="#" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Career Blog</Link></li>
              </ul>
            </div>
            <div className="flex flex-col gap-4">
              <h3 className="font-display font-bold text-lg text-white">Legal</h3>
              <ul className="space-y-3">
                <li><Link to="#" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Privacy Policy</Link></li>
                <li><Link to="#" className="text-text-on-dark/60 hover:text-brass transition-colors focus:outline-none focus:ring-2 focus:ring-brass rounded-sm">Terms of Service</Link></li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-text-on-dark/40 text-sm">
            © {new Date().getFullYear()} AI Resume Builder. All rights reserved.
          </p>
          <p className="text-text-on-dark/40 text-sm flex items-center gap-1">
            Built with <span className="text-teal font-semibold">precision</span> for job seekers worldwide.
          </p>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
