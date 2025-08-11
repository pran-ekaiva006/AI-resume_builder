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
import Footer from "@/components/custom/Footer";
import Header from "@/components/custom/Header";

export default function Home() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      text: "This AI resume builder helped me land my dream job at a Fortune 500 company!",
      author: "DhruvMohan Shukla",
      role: "Software Engineer",
    },
    {
      text: "The AI suggestions were spot-on. My resume looks incredibly professional now.",
      author: "Krishn Kumar",
      role: "Marketing Manager",
    },
    {
      text: "I got 3x more interview calls after using this platform. Highly recommended!",
      author: "Rahul Singh",
      role: "Data Scientist",
    },
  ];

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

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative overflow-hidden pt-20 pb-32">
          <div className="absolute inset-0 -z-10">
            <div className="absolute top-20 left-10 w-20 h-20 bg-blue-200/30 rounded-full blur-xl animate-pulse"></div>
            <div className="absolute top-40 right-20 w-32 h-32 bg-purple-200/30 rounded-full blur-xl animate-pulse delay-1000"></div>
            <div className="absolute bottom-20 left-1/3 w-24 h-24 bg-pink-200/30 rounded-full blur-xl animate-pulse delay-2000"></div>
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="text-5xl md:text-7xl font-extrabold leading-tight mb-8">
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                Build Your
              </span>
              <br />
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Perfect Resume
              </span>
              <br />
              <span className="bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent">
                With AI
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto mb-12 leading-relaxed">
              Transform your career with our AI-powered resume builder. Create
              professional, ATS-friendly resumes that get you noticed by top
              employers.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <a
                href="https://rococo-crisp-bd2a6c.netlify.app/auth/sign-in"
                className="group bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:shadow-2xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1"
              >
                Start Building Free
                <ArrowRight className="inline-block ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </a>
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
              <a
                href="https://rococo-crisp-bd2a6c.netlify.app/dashboard"
                className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-10 py-4 rounded-full text-lg font-semibold hover:shadow-xl hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-1 inline-flex items-center"
              >
                Start Building Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </a>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-white overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Success Stories
              </h2>
              <p className="text-xl text-gray-600">
                Join thousands who've transformed their careers
              </p>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-3xl p-12 text-center border border-blue-200/50">
                <div className="flex justify-center mb-6">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-8 w-8 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 mb-8 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div>
                  <div className="font-bold text-gray-900 text-lg">
                    {testimonials[currentTestimonial].author}
                  </div>
                  <div className="text-gray-600">
                    {testimonials[currentTestimonial].role}
                  </div>
                </div>
              </div>

              <div className="flex justify-center space-x-2 mt-8">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all ${
                      index === currentTestimonial
                        ? "bg-blue-600 w-8"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setCurrentTestimonial(index)}
                  />
                ))}
              </div>
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
