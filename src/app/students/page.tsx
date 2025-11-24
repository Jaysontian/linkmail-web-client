'use client';

import React, { useState } from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

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

export default function StudentsPage() {
  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="px-4 sm:px-6 lg:px-8 py-2">
        <Header onTryForFree={handleDownload} />
      </div>

      {/* Hero Section */}
      <main className="w-full min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] flex items-start lg:items-center justify-center py-4 lg:pt-0 lg:pb-6 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-center">

            {/* LEFT CONTENT */}
            <div className="flex-1 w-full lg:w-1/2 text-left tracking-tighter space-y-4 lg:space-y-12">

              {/* Section 1 */}
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                  <span className="font-bold">Networking Isn&apos;t Optional.</span>
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-secondary mt-1 leading-relaxed">
                  Hundreds of online applications won&apos;t get you noticed.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                  Referrals Get Results.
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-secondary mt-1 leading-relaxed">
                  Recruiters trust introductions — they&apos;re <span className="font-bold">4× more likely</span> to get a response.
                </p>
              </div>


              {/* Section 4 */}
              <div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                  Email Works. LinkedIn DMs Don&apos;t.
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-secondary mt-1 leading-relaxed">
                  Professionals are busy. They check emails — not DMs.
                </p>
              </div>

              {/* Section 5 (CTA Intro) */}
              <div className="pt-0 lg:pt-2">
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-primary leading-tight">
                  Use LinkMail.
                </h2>
                <p className="text-sm sm:text-base lg:text-lg text-secondary mt-1 leading-relaxed max-w-xl">
                  Personalized outreach. Done in seconds.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-2 items-start pt-0 lg:pt-2">
                <button
                  onClick={handleDownload}
                  className="bg-accent cursor-pointer text-white px-6 py-2.5 rounded-lg text-base transition-colors font-medium w-full sm:w-auto"
                >
                  Join For Free
                </button>
              </div>
            </div>

            {/* RIGHT SIDE VIDEO */}
            <div className="flex flex-1 w-full lg:w-1/2 items-center justify-center lg:justify-end mt-4 lg:mt-0">
              <div className="w-full max-w-sm lg:max-w-none rounded-xl overflow-hidden border border-border shadow-lg">
                <video
                  src="/demo_1.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-cover"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </div>

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
            <h3 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-3">
              What Students Are Saying
            </h3>
            <p className="text-base sm:text-lg text-secondary max-w-2xl mx-auto">
              Real stories from students who landed their dream roles
            </p>
          </div>
          
          <div className="relative overflow-hidden">
            {/* Gradient overlays for fade effect */}
            <div className="absolute left-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-r from-background to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-20 lg:w-32 bg-gradient-to-l from-background to-transparent z-10 pointer-events-none"></div>
            
            {/* Continuous Scrolling Container */}
            <div className="flex gap-6 animate-scroll-seamless py-2">
              {/* Show 6 cards twice for seamless infinite loop */}
              {[...testimonials, testimonials[0], testimonials[1], ...testimonials, testimonials[0], testimonials[1]].map((testimonial, index) => (
                <div
                  key={index}
                  className="flex-shrink-0 w-[280px] sm:w-[380px] lg:w-[480px] bg-background border-2 border-border hover:border-primary rounded-2xl p-6 sm:p-8 shadow-lg hover:shadow-xl transition-all duration-300 group"
                >
                  {/* Quote icon */}
                  <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  
                  <p className="text-sm sm:text-base lg:text-lg text-primary leading-relaxed mb-6">
                    {testimonial.quote}
                  </p>
                  
                  <div className="flex items-center gap-3 pt-4 border-t border-border">
                    {/* Avatar placeholder */}
                    <div className="w-12 h-12 bg-accent rounded-full flex items-center justify-center text-white font-bold text-lg">
                      {testimonial.author.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm sm:text-base font-semibold text-primary">
                        {testimonial.author}
                      </p>
                      <p className="text-xs sm:text-sm text-secondary">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
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
            animation: scrollSeamless 20s linear infinite;
          }
          
          .animate-scroll-seamless:hover {
            animation-play-state: paused;
          }
        `}</style>
      </section>

      <Footer />
    </div>
  );
}
