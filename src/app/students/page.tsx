'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CHROME_WEB_STORE_URL =
  'https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa';

export default function StudentsPage() {
  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-2">
      <Header onTryForFree={handleDownload} />

      <main className="w-full min-h-[calc(100vh-8rem)] lg:h-[calc(100vh-5rem)] flex items-start lg:items-center justify-center py-4 lg:pt-0 lg:pb-6">
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

      <Footer />
    </div>
  );
}
