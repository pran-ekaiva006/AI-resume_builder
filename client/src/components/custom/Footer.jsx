import React from "react";
import { FileText } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-surface text-text-on-dark py-16 font-body border-t-2 border-ink">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Brand & About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-brass border-2 border-ink p-2 rounded-lg">
                <FileText className="h-6 w-6 text-ink" />
              </div>
              <span className="font-display text-xl font-bold">AI Resume Builder</span>
            </div>
            <p className="text-text-on-dark/70 leading-relaxed max-w-md">
              We help you create professional resumes effortlessly with
              AI-powered suggestions and templates.
            </p>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-display font-semibold mb-4 text-lg">Contact Us</h4>
            <ul className="space-y-2 text-text-on-dark/70">
              <li>
                <a href="https://github.com/pran-ekaiva006" target="_blank" rel="noopener noreferrer" className="hover:text-brass transition-colors duration-200">
                  GitHub Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-text-on-dark/10 pt-8 text-center text-text-on-dark/50 text-sm">
          © {new Date().getFullYear()} AI Resume Builder. All rights reserved. Built
          with ❤️ for job seekers worldwide.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
