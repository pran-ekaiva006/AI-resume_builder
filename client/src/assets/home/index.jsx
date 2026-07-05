import React, { useState, useEffect } from "react";
import { 
  Share2, 
  ArrowRight, 
  Star, 
  Download,
  Zap,
  FileText,
  Brain
} from "lucide-react";
import Footer from "client/src/components/custom/Footer";
import Header from "client/src/components/custom/Header";
import { Link } from "react-router-dom";
import ResumeAssemblyHero from "../../components/three/ResumeAssemblyHero";

export default function Home() {



  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content",
      description:
        "Our AI analyzes job descriptions and suggests perfect content tailored to your industry and role.",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "Create a professional resume in minutes, not hours. Our smart templates adapt to your information instantly.",
    },
    {
      icon: Share2,
      title: "Easy Sharing",
      description:
        "Share your resume with a unique URL or download it instantly. Perfect for online applications.",
    },
  ];

  const steps = [
    {
      step: "01",
      icon: FileText,
      title: "Enter Your Information",
      description:
        "Simply input your personal details, work experience, education, and skills. Our AI will guide you through each section.",
    },
    {
      step: "02",
      icon: Brain,
      title: "AI Enhances Your Content",
      description:
        "Our advanced AI analyzes your input and suggests improvements, optimizes keywords, and enhances your descriptions.",
    },
    {
      step: "03",
      icon: Download,
      title: "Download & Apply",
      description:
        "Choose from professional templates, customize your design, and download your ATS-optimized resume instantly.",
    },
  ];



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-ink text-text-on-dark min-h-[calc(100vh-80px)] flex items-center pt-24 pb-16 lg:pt-0 lg:pb-0">
          
          {/* Grid Overlay */}
          <div 
            className="absolute inset-0 z-0 pointer-events-none"
            style={{
              backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)',
              backgroundSize: '4rem 4rem'
            }}
          ></div>

          {/* Registration Marks */}
          <div className="absolute top-6 left-6 w-8 h-8 border-t border-l border-parchment/40 pointer-events-none hidden sm:block"></div>
          <div className="absolute top-6 right-6 w-8 h-8 border-t border-r border-parchment/40 pointer-events-none hidden sm:block"></div>
          <div className="absolute bottom-6 left-6 w-8 h-8 border-b border-l border-parchment/40 pointer-events-none hidden sm:block"></div>
          <div className="absolute bottom-6 right-6 w-8 h-8 border-b border-r border-parchment/40 pointer-events-none hidden sm:block"></div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
              
              {/* Left Column: Copy & CTAs */}
              <div className="text-left max-w-2xl">
                <h1 className="font-display text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                  Turn your experience into an interview-ready resume.
                </h1>
                <p className="font-body text-lg sm:text-xl text-text-on-dark/80 mb-10 max-w-xl leading-relaxed">
                  Build a professional resume tailored to your industry in minutes. Let our intelligent formatting engine handle the design while you focus on taking the next step in your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/auth/sign-in" 
                    className="inline-flex justify-center items-center bg-brass text-ink px-8 py-4 rounded-md font-body font-semibold text-lg hover:brightness-110 transition-all duration-300 shadow-sm"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a 
                    href="#how-it-works"
                    className="inline-flex justify-center items-center bg-transparent border border-parchment/30 text-text-on-dark px-8 py-4 rounded-md font-body font-semibold text-lg hover:border-parchment hover:bg-parchment/5 transition-all duration-300"
                  >
                    See how it works
                  </a>
                </div>
              </div>

              {/* Right Column: 3D Hero */}
              <div className="w-full relative lg:-mr-12">
                <ResumeAssemblyHero />
              </div>
              
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Why Choose Our AI Resume Builder?
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Powered by advanced AI technology to give you the competitive edge you need
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="group p-8 rounded-2xl bg-gradient-to-br from-gray-50 to-white border border-gray-200 hover:border-blue-300 hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-3 rounded-xl w-fit mb-6 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-gradient-to-br from-blue-50 to-purple-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                How It Works
              </h2>
              <p className="text-xl text-gray-600">
                Create your perfect resume in just 3 simple steps
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
              <div className="hidden md:block absolute top-24 left-1/3 right-1/3 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300"></div>
              <div className="hidden md:block absolute top-24 left-0 right-2/3 h-0.5 bg-gradient-to-r from-transparent to-blue-300"></div>

              {steps.map((step, index) => (
                <div key={index} className="relative text-center">
                  <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                      {step.step}
                    </div>
                    <step.icon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-bold text-gray-900 mb-3">{step.title}</h3>
                    <p className="text-gray-600 leading-relaxed">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
            <Link
  to="/dashboard"
  className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center"
>
  Start Building Your Resume
  <ArrowRight className="ml-2 h-5 w-5" />
</Link>

            </div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-24 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Land Your Dream Job?
            </h2>
            <p className="text-xl mb-10 opacity-90">
              Join thousands of professionals who've already transformed their careers with our AI-powered resume builder.
            </p>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}
