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

      <main className="w-full h-[calc(100vh-5rem)] flex items-center justify-center pt-0 pb-4 lg:pt-0 lg:pb-6">
        <div className="w-full max-w-7xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 items-center lg:items-center">

            {/* LEFT CONTENT */}
            <div className="flex-1 w-full lg:w-1/2 text-left tracking-tighter space-y-12">

              {/* Section 1 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  <span className="font-bold">The Harsh Truth:</span>
                </h2>
                <p className="text-base sm:text-lg text-secondary mt-1 leading-relaxed">
                  You won&apos;t hear back from the hundreds of online applications you&apos;ve sent out.
                </p>
              </div>

              {/* Section 2 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  Referrals are <span className="font-bold">4× more likely</span> to get a response.
                </h2>
                <p className="text-base sm:text-lg text-secondary mt-1 leading-relaxed">
                  Recruiters trust introductions — not random applications in a stack of thousands.
                </p>
              </div>

              {/* Section 3 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  Networking isn&apos;t optional anymore.
                </h2>
                <p className="text-base sm:text-lg text-secondary mt-1 leading-relaxed">
                  It&apos;s the difference between silence and opportunity.
                </p>
              </div>

              {/* Section 4 */}
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  Email Works. LinkedIn DMs Don&apos;t.
                </h2>
                <p className="text-base sm:text-lg text-secondary mt-1 leading-relaxed">
                  Professionals are busy. They check emails — not LinkedIn DMs.
                </p>
              </div>

              {/* Section 5 (CTA Intro) */}
              <div className="pt-2">
                <h2 className="text-2xl sm:text-3xl font-bold text-primary leading-tight">
                  Use LinkMail.
                </h2>
                <p className="text-base sm:text-lg text-secondary mt-1 leading-relaxed max-w-xl">
                  Automate and Personalize your outreach.  
                  Get in front of the right people — fast.
                </p>
              </div>

              {/* CTA Button */}
              <div className="flex flex-col sm:flex-row gap-2 items-start pt-2">
                <button
                  onClick={handleDownload}
                  className="bg-accent cursor-pointer text-white px-6 py-2.5 rounded-lg text-base transition-colors font-medium w-full sm:w-auto"
                >
                  Join For Free
                </button>
              </div>
            </div>

            {/* RIGHT SIDE VIDEO */}
            <div className="flex-1 w-full lg:w-1/2 flex items-center justify-center lg:justify-end">
              <div className="w-full max-w-md lg:max-w-none rounded-xl overflow-hidden border border-border shadow-lg">
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
