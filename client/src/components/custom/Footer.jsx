import React from "react";
import { FileText } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Brand & About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Resume Builder</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We help you create professional resumes effortlessly with
              AI-powered suggestions and templates.
            </p>
          </div>

              <li>
                <a href="https://github.com/pran-ekaiva006" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">
                  GitHub Profile
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} AI Resume Builder. All rights reserved. Built
          with ❤️ for job seekers worldwide.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
