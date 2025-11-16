'use client';

import React from 'react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa';

export default function StudentsPage() {
  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

  return (
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-2">
      <Header onTryForFree={handleDownload} />

      <main className="w-full min-h-[calc(100vh-10rem)] flex items-center justify-center py-8 lg:py-12">
        <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 lg:gap-12 items-center lg:items-start">
            {/* Left: Text Content */}
            <div className="flex-1 text-left tracking-tighter">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tiempos-medium font-bold text-primary mb-4 leading-tight">
                Recruiting is a game.
              </h1>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tiempos-medium font-bold text-primary mb-4 lg:mb-6 leading-tight">
                We gave you the controller that
                <br />
                no one else has.
              </h1>
              <p className="text-base sm:text-lg text-secondary mb-8 lg:mb-12 leading-relaxed">
                (do it in 10 seconds per recruiter)
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-start items-start">
                <button
                  onClick={handleDownload}
                  className="bg-accent cursor-pointer text-white px-6 py-2 rounded-lg text-base transition-colors font-medium w-full sm:w-auto"
                >
                  Join For Free
                </button>
              </div>
            </div>

            {/* Right: Video */}
            <div className="flex flex-1 w-full lg:w-full items-end justify-end">
              <div className="w-full lg:w-1/2 rounded-xl overflow-hidden border border-border">
                <video
                  src="/demo_1.webm"
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="w-full h-auto object-contain"
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

