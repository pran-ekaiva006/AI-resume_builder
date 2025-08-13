import React from "react";
import { FileText } from "lucide-react";

function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Grid Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand & About */}
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 rounded-xl">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <span className="text-xl font-bold">AI Resume Pro</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              We help you create professional resumes effortlessly with
              AI-powered suggestions and templates.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h4 className="font-semibold mb-4">Product</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Resume Builder
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Templates
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Cover Letters
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  LinkedIn Optimizer
                </a>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="font-semibold mb-4">Resources</h4>
            <ul className="space-y-2 text-gray-400">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Career Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Resume Examples
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Interview Tips
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Career Guides
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-2 text-gray-400">
              <li>Email: support@ai-resumebuilder.com</li>
              <li>Phone: +91 8076XXXXXX</li>
              <li>
                Address: 56 Arera Colony, Bhopal, Madhya Pradesh, 462016, India
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 text-center text-gray-400 text-sm">
          © {new Date().getFullYear()} AI Resume Pro. All rights reserved. Built
          with ❤️ for job seekers worldwide.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
