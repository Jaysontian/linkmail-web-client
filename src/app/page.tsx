'use client';

import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { AnimatedShinyText } from '@/components/ui/animated-shiny-text';
import { BorderBeam } from '@/components/ui/border-beam';
import { ParticlesBackground } from '@/components/Particles';
import { HandConstellation } from '@/components/HandConstellation';

const CHROME_WEB_STORE_URL =
  'https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa';

const testimonials = [
  {
    quote: "LinkMail helped me get a referral for my dream company — SpaceX. I landed an interview, passed it, and got the job. This tool literally changed my career.",
    author: "Sarah M.",
    role: "Aerospace Engineering Student"
  },
  {
    quote: "I already knew networking was important, but it was so time-consuming to send personalized messages. LinkMail saved me countless hours while building my network.",
    author: "James L.",
    role: "Computer Science Student"
  },
  {
    quote: "LinkMail's templates make it so easy to generate emails exactly how I want them. Customizing and personalizing each message takes seconds instead of minutes.",
    author: "Emily R.",
    role: "Cognitive Science Student"
  },
  {
    quote: "Within a week of using LinkMail, I had responses from 3 different companies. The personalized outreach made all the difference.",
    author: "Michael T.",
    role: "Economics Student"
  }
];

export default function Home() {
  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

  useEffect(() => {
    // Hide scrollbar but keep scrolling functionality
    const style = document.createElement('style');
    style.textContent = `
      html, body {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
      html::-webkit-scrollbar, body::-webkit-scrollbar {
        display: none;
      }
    `;
    document.head.appendChild(style);
    
    // Cleanup on unmount
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="dark min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <Header onTryForFree={handleDownload} className="fixed top-0 left-0 right-0 z-50 px-8" />
      </div>

      <main className="relative w-full min-h-[calc(100vh-5rem)] flex items-center justify-center py-4 lg:py-6 px-4 sm:px-6 lg:px-8 overflow-visible mt-16 mb-8">
        {/* Particles Background */}
        <ParticlesBackground />

        {/* Hand constellation - desktop only */}
        {/* <motion.div 
          initial={{ opacity: 0, x: 0 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.0, delay: 1.2, ease: "easeOut" }}
          className="hidden lg:block absolute -left-20 top-1/2 -translate-y-1/2 z-0 pointer-events-none"
        >
          <HandConstellation 
            scale={0.7}
            connectionDistance={50}
            className="xl:scale-110 2xl:scale-125 origin-center"
          />
        </motion.div> */}

        <div className="relative z-10 w-full max-w-4xl flex flex-col items-center justify-center text-center overflow-visible">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="text-3xl sm:text-4xl lg:text-5xl font-semibold text-primary mb-6"
          >
            Warm Recruiting, <AnimatedShinyText >100x Faster</AnimatedShinyText>.
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5, ease: "easeOut" }}
            className="w-full max-w-2xl text-secondary text-[18px] mb-16"
          >
            <p className="mb-3">Supercharge your LinkedIn with:</p>
            <div className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-[16px]">
              <span className="flex items-center gap-2">
                <span className="text-accent">✓</span> Automatic email finding
              </span>
              <span className="flex items-center gap-2">
                <span className="text-accent">✓</span> Profile analysis
              </span>
              <span className="flex items-center gap-2">
                <span className="text-accent">✓</span> Personalized outreach in your tone
              </span>
            </div>
          </motion.div>
          
          {/* Video */}
          <div className="relative w-full max-w-lg lg:max-w-3xl p-8 overflow-visible">
            {/* Glow wrapper with gradient background */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, delay: 0.8, ease: "easeOut" }}
              className="absolute inset-8"
            >
              <div 
                className="w-full h-full rounded-3xl opacity-70"
                style={{
                  background: 'linear-gradient(135deg, rgba(34,211,238,0.55) 0%, rgba(56,189,248,0.52) 20%, rgba(59,130,246,0.55) 40%, rgba(96,165,250,0.45) 60%, rgba(59,78,179,0.50) 80%, rgba(34,211,238,0.42) 100%)',
                  filter: 'blur(48px)',
                }}
              />
            </motion.div>
            
            {/* Video wrapper with backdrop blur */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.0, delay: 1.0, ease: "easeOut" }}
              className="relative p-4 bg-white/10 backdrop-blur-sm rounded-4xl border border-white/10 shadow-2xl overflow-hidden"
            >
              <video
                src="/demo_1.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-cover rounded-2xl shadow-md"
              >
                Your browser does not support the video tag.
              </video>
              <BorderBeam
                duration={6}
                size={400}
                colorFrom="#3b82f6"
                colorTo="#22d3ee"
                className="from-transparent via-blue-500 to-transparent"
              />
              <BorderBeam
                duration={6}
                delay={3}
                size={400}
                borderWidth={2}
                colorFrom="#22d3ee"
                colorTo="#ec4899"
                className="from-transparent via-cyan-500 to-transparent"
              />
            </motion.div>
          </div>
        </div>
      </main>

      {/* Testimonials Section */}
      <section className="w-full py-16 lg:py-20 bg-background overflow-hidden relative">
        {/* Background decoration */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-accent rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
        </div>
        
        <div className="w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-12">
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-semibold text-primary mb-3">
              Success Stories
            </h3>
            <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto">
              Real stories from students who landed their dream job from a Linkmail.
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            {/* Scrollable Container */}
            <div className="overflow-hidden">
              {/* Continuous Scrolling Container */}
              <div className="flex gap-6 py-2 animate-scroll-seamless min-w-full lg:min-w-[1200px]">
                {/* Show 6 cards twice for seamless infinite loop */}
                {[...testimonials, testimonials[0], testimonials[1], ...testimonials, testimonials[0], testimonials[1]].map((testimonial, index) => (
                  <div
                    key={index}
                    className="flex-shrink-0 w-80 md:w-96 lg:w-[400px] max-w-[90vw] bg-background border border-border rounded-xl p-4 sm:p-5 shadow-md group select-none pointer-events-none"
                  >
                    {/* Quote icon */}
                    <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center mb-3">
                      <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                      </svg>
                    </div>
                    
                    <p className="text-sm text-secondary leading-relaxed mb-4">
                      {testimonial.quote}
                    </p>
                    
                    <div className="flex items-center gap-2 pt-3 border-t border-border">
                      {/* Avatar placeholder */}
                      <div className="w-8 h-8 bg-accent rounded-full flex items-center justify-center text-white font-semibold text-sm">
                        {testimonial.author.charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-primary">
                          {testimonial.author}
                        </p>
                        <p className="text-xs text-secondary">
                          {testimonial.role}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Add CSS animation */}
        <style jsx>{`
          @keyframes scrollSeamless {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          
          .animate-scroll-seamless {
            animation: scrollSeamless 5s linear infinite;
          }
          
          @media (min-width: 1024px) {
            .animate-scroll-seamless {
              animation: scrollSeamless 5s linear infinite;
            }
          }
        `}</style>
      </section>

      <Footer />
    </div>
  );
}
