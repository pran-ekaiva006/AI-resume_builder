import React from "react";
import { 
  Share2, 
  ArrowRight, 
  Download,
  Zap,
  FileText,
  Brain
} from "lucide-react";
import Footer from "client/src/components/custom/Footer";
import Header from "client/src/components/custom/Header";
import { Link } from "react-router-dom";
import ResumeAssemblyHero from "../../components/three/ResumeAssemblyHero";
import { motion, MotionConfig } from "framer-motion";

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
      <MotionConfig reducedMotion="user">
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
                <h1 className="font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
                  Turn your experience into an interview-ready resume.
                </h1>
                <p className="font-body text-base sm:text-lg md:text-xl text-text-on-dark/80 mb-10 max-w-xl leading-relaxed">
                  Build a professional resume tailored to your industry in minutes. Let our intelligent formatting engine handle the design while you focus on taking the next step in your career.
                </p>
                <div className="flex flex-col sm:flex-row gap-4">
                  <Link 
                    to="/auth/sign-in" 
                    className="inline-flex justify-center items-center bg-brass text-ink px-8 py-4 rounded-md font-body font-semibold text-lg hover:brightness-110 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-brass focus:ring-offset-2 focus:ring-offset-ink"
                  >
                    Get Started
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                  <a 
                    href="#how-it-works"
                    className="inline-flex justify-center items-center bg-transparent border border-parchment/30 text-text-on-dark px-8 py-4 rounded-md font-body font-semibold text-lg hover:border-parchment hover:bg-parchment/5 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-parchment focus:ring-offset-2 focus:ring-offset-ink"
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
        <section id="features" className="py-24 bg-parchment text-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Why Choose Our AI Resume Builder?
              </h2>
              <p className="font-body text-xl text-ink/80 max-w-3xl mx-auto">
                Powered by advanced AI technology to give you the competitive edge you need
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {features.map((feature) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.1 }}
                  className="group p-8 rounded-xl bg-parchment border border-ink/10 shadow-[0_2px_8px_rgba(16,19,28,0.04),0_8px_24px_rgba(16,19,28,0.04),0_16px_32px_rgba(16,19,28,0.04)] hover:-translate-y-1 hover:shadow-[0_4px_12px_rgba(16,19,28,0.06),0_12px_32px_rgba(16,19,28,0.06),0_24px_48px_rgba(16,19,28,0.06)] transition-all duration-300 flex flex-col"
                >
                  <div className="bg-brass border-2 border-ink p-3 rounded-lg w-fit mb-6">
                    <feature.icon className="h-6 w-6 text-ink" />
                  </div>
                  <h3 className="font-display text-xl font-bold mb-3">
                    {feature.title}
                  </h3>
                  <p className="font-body text-ink/80 leading-relaxed">
                    {feature.description}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* How it Works Section */}
        <section id="how-it-works" className="py-24 bg-surface text-text-on-dark border-y-2 border-ink">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center mb-20"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                How It Works
              </h2>
              <p className="font-body text-xl text-text-on-dark/80">
                Create your perfect resume in just 3 simple steps
              </p>
            </motion.div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
              {steps.map((step, index) => (
                <motion.div 
                  key={step.title} 
                  className="relative flex flex-col"
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.2, ease: "easeOut", delay: index * 0.1 }}
                >
                  <div className="font-mono text-brass font-bold text-lg mb-4">
                    {step.step}
                  </div>
                  <div className="mb-4">
                    <step.icon className="h-8 w-8 text-teal" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-3">{step.title}</h3>
                  <p className="font-body text-text-on-dark/80 leading-relaxed">{step.description}</p>
                </motion.div>
              ))}
            </div>

            <motion.div 
              className="text-center mt-20"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <Link
                to="/dashboard"
                className="inline-flex justify-center items-center bg-teal text-ink px-8 py-4 rounded-md font-body font-semibold text-lg hover:brightness-110 transition-all duration-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-teal focus:ring-offset-2 focus:ring-offset-surface"
              >
                Start Building Your Resume
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </motion.div>
          </div>
        </section>


        {/* CTA Section */}
        <section className="py-24 bg-brass text-ink relative overflow-hidden">
          <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.2, ease: "easeOut" }}
            >
              <h2 className="font-display text-4xl md:text-5xl font-bold tracking-tight mb-6">
                Ready to Land Your Dream Job?
              </h2>
              <p className="font-body text-xl mb-10 opacity-90 max-w-2xl mx-auto">
                Join thousands of professionals who've already transformed their careers with our AI-powered resume builder.
              </p>
              <Link 
                to="/auth/sign-in" 
                className="inline-flex justify-center items-center bg-ink text-parchment px-10 py-4 rounded-md font-body font-semibold text-lg hover:bg-ink/90 transition-all duration-300 shadow-[4px_4px_0_rgba(16,19,28,0.2)] hover:-translate-y-1 hover:shadow-[6px_6px_0_rgba(16,19,28,0.2)] focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2 focus:ring-offset-brass"
              >
                Get Started Now
              </Link>
            </motion.div>
          </div>
        </section>
        </main>
      </MotionConfig>
      <Footer />
    </div>
  );
}
