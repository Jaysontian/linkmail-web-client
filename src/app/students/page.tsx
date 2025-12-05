'use client';

import React, { useRef, useEffect, useState, Suspense } from "react";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { useAuth } from '@/hooks/useAuth';
import { useRouter, useSearchParams } from 'next/navigation';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import Float from '@/components/fancy/blocks/float';
import { Linkedin, ListChecks, MailCheck } from "lucide-react";

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa';

// Component for cycling through different texts with fade in/out animation
function CyclingFadeText({ texts, interval = 4000 }: { texts: string[], interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      // Fade out
      setIsVisible(false);
      
      // After fade out completes, change text and fade in
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % texts.length);
        setIsVisible(true);
      }, 250); // Half of transition duration (500ms / 2)
    }, interval);

    return () => clearInterval(cycleInterval);
  }, [texts.length, interval]);

  return (
    <span
      className="inline-block transition-opacity duration-500 ease-in-out"
      style={{ opacity: isVisible ? 1 : 0 }}
    >
      {texts[currentIndex]}
    </span>
  );
}

// Component to capture referral code from URL
function ReferralCapture() {
  const searchParams = useSearchParams();
  
  useEffect(() => {
    const ref = searchParams.get('ref');
    if (ref) {
      localStorage.setItem('linkmail_referral_code', ref);
      console.log('[HomePage] Stored referral code:', ref);
    }
  }, [searchParams]);

  return null;
}

export default function StudentsPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

  const networkerTexts = [
    "networking",
    "outreach", 
    "people investing",
    "people investors",
  ];

  const paths = [
    // Down, up all the way, then down, parabolic style:
    "M 20,0 Q 30,100 50,80 Q 70,60 95,90",
    "M 5,100 Q 30,30 50,50 Q 70,70 95,20",
  ];

  const texts = [
    `NETWORKING • CONNECTIONS • GROWTH • SUCCESS • OPPORTUNITIES • COLLABORATION • INNOVATION • LEADERSHIP • ON LINKEDIN • `,
    `LINKEDIN • EMAIL • OUTREACH • TRACKING • ANALYTICS • AUTOMATION • AI • PRODUCTIVITY • AUTOMATION • AI • PRODUCTIVITY`,
  ];

  return (
    <div>
      {/* Capture referral code from URL */}
      <Suspense fallback={null}>
        <ReferralCapture />
      </Suspense>
      
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-2">
      <Header onTryForFree={handleDownload} />

      <main className="mx-auto max-w-7xl min-h-[calc(100vh-10rem)] flex flex-col lg:flex-row">
        {/* Left Panel - Callout */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-lg mx-auto lg:mx-0 text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tiempos-medium font-bold text-primary mb-4 lg:mb-6 leading-tight">
              Made for <br className="block" /> <CyclingFadeText texts={networkerTexts} />.
            </h1>
            <p className="text-base sm:text-lg text-secondary mb-8 lg:mb-12 leading-relaxed">
              The AI for people searching, email finding, <br className="hidden sm:block" />and outreach tracking
            </p>
            <div className="flex justify-center">
              {isLoading ? (
                <div className="animate-pulse bg-gray-200 h-8 w-20 rounded"></div>
              ) : user ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-primary cursor-pointer text-background px-4 py-1.5 rounded-lg text-sm transition-colors font-medium"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={handleDownload}
                  className="flex items-center justify-center px-6 py-2 bg-primary text-background font-medium rounded-lg hover:opacity-90 cursor-pointer transition-colors shadow-md"
                >
                  <img
                    src="/chrome.png"
                    alt="Chrome"
                    className="inline-block w-4 h-4 mr-2 align-middle"
                    style={{ verticalAlign: "middle" }}
                  />
                  Download Now
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Blue Square */}
        <div 
          className="w-full lg:w-1/2 bg-[#1E67B5] flex items-center justify-center rounded-xl relative overflow-hidden min-h-[300px] lg:min-h-0 mt-8 lg:mt-0"
          ref={containerRef}
        >
          {/* Hands image */}
          <div className="text-white text-center z-10 scale-105">
            <Float amplitude={[5, 10, 5]} rotationRange={[5, 5, 0]} speed={0.5}>
              <img
                src="/hands.png"
                alt="Hands illustration"
                className="mx-auto w-full h-auto object-contain"
              />
            </Float>
          </div>

          {/* Curved text overlay */}
          <div className="absolute w-full h-full flex flex-col">
            {paths.map((path, i) => (
              <AnimatedPathText
                key={`auto-path-${i}`}
                path={path}
                pathId={`auto-path-${i}`}
                svgClassName={`absolute -left-[100px] top-0 w-[calc(100%+200px)] h-full`}
                viewBox="0 0 100 100"
                text={texts[i] || ''}
                textClassName={`text-primary text-[2px] font-bold fill-black/35`}
                animationType="auto"
                duration={i * 0.5 + 8}
                textAnchor="start"
              />
            ))}
          </div>
        </div>

      </main>

      {/* Second Section – Features */}

      <div className="mx-auto max-w-7xl pt-12 sm:pt-16 lg:pt-24 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center pb-8 sm:pb-12">

        <div className="flex-1 flex flex-col justify-center px-4 sm:px-8 py-4 sm:py-6 text-center">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-primary mb-4 sm:mb-6 font-tiempos-medium">Networking, but 20x faster.</h2>
          <p className="max-w-lg text-base sm:text-lg text-secondary mb-8 sm:mb-12 leading-relaxed px-4">
            Linkmail helps you level up your networking and outreach – find more jobs, outreach more people, send more follow ups.
          </p>
        </div>

        <div className="flex flex-col w-full items-stretch justify-center">
          {/* Left: Video Demo */}
          <div className="flex-1 flex flex-col justify-center items-center px-4 sm:px-8 lg:px-12 py-4">
            <div className="w-full max-w-3xl rounded-xl overflow-hidden border border-border">
              <video
                src="/demo_1.webm"
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto object-contain scale-101"
                poster="/demo_poster.png"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Right: Expandable Features */}
          {/* Import Lucide icons at the top of your file if not already imported:
              import { Linkedin, MailCheck, ListChecks } from "lucide-react";
          */}
          <div className="flex-1 flex flex-col justify-center items-center py-4 mt-8 sm:mt-12">
            <div className="flex flex-col sm:flex-row w-full max-w-5xl gap-6 sm:gap-8 px-4 sm:px-0">
              {[
                {
                  title: "Your LinkedIn Companion",
                  content:
                    "Linkmail lives right inside LinkedIn and appears when you're on someone's profile.",
                  icon: <Linkedin strokeWidth={1.5} className="w-8 h-8 mr-2 text-primary" />,
                },
                {
                  title: "Automatic Email Finding",
                  content:
                    "Get verified professional emails for your prospects instantly. Useful for students and recruiters.",
                  icon: <MailCheck strokeWidth={1.5} className="w-8 h-8 mr-2 text-primary" />,
                },
                {
                  title: "Outreach with Agents",
                  content:
                    "Track your outreach, follow-ups, and responses in one place. Stay organized and never miss an opportunity to connect.",
                  icon: <ListChecks strokeWidth={1.5} className="w-8 h-8 mr-2 text-primary" />,
                },
              ].map((feature, idx) => (
                <div key={idx} className="w-full sm:w-1/3 my-4 sm:my-8 last:mb-0">
                  <div className="mb-4">{feature.icon}</div>
                  <h3 className="text-xl sm:text-2xl font-semibold text-primary font-tiempos-regular mb-2 flex items-center gap-2">
                    {feature.title}
                  </h3>
                  <p className="text-sm sm:text-md text-tertiary mt-4 sm:mt-6">{feature.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      
      </div>


    </div>

    <Footer />
            
    </div>
  );
}
