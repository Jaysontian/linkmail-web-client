'use client';

import React, { useRef, useEffect, useState } from "react";
import { ProtectedRoute } from '@/components/ProtectedRoute';
import { LoginButton } from '@/components/LoginButton';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { getOAuthUrl } from '@/lib/api';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import ScrambleIn, { ScrambleInHandle } from '@/components/fancy/text/scramble-in';
import Float from '@/components/fancy/blocks/float';
import { Linkedin, ListChecks, MailCheck } from "lucide-react";

// Component for cycling through different texts with scramble animation
function CyclingScrambleText({ texts, interval = 4000 }: { texts: string[], interval?: number }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrambleRef = useRef<ScrambleInHandle>(null);

  useEffect(() => {
    const cycleInterval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % texts.length);
    }, interval);

    return () => clearInterval(cycleInterval);
  }, [texts.length, interval]);

  useEffect(() => {
    // Start scramble animation when text changes
    if (scrambleRef.current) {
      scrambleRef.current.start();
    }
  }, [currentIndex]);

  return (
    <ScrambleIn
      ref={scrambleRef}
      text={texts[currentIndex]}
      scrambleSpeed={25}
      scrambledLetterCount={5}
      autoStart={false}
    />
  );
}

export default function Home() {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleTryForFree = () => {
    // Redirect to backend OAuth flow
    window.location.href = getOAuthUrl();
  };

  const networkerTexts = [
    "cracked networkers",
    "internship searchers", 
    "LinkedIn warriors",
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
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-2">
      <header>
        <div className="mx-auto max-w-7xl">
          <div className="flex justify-between items-center h-auto py-8">
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="Linkmail Logo"
                className="h-8 w-8 mr-3"
                style={{ objectFit: "contain" }}
              />
              <h1 className="text-xl font-semibold font-tiempos-medium text-primary">Linkmail</h1>
              <div className="text-xs text-secondary ml-2 py-1 px-2 rounded-lg bg-accent-ultra-light">Beta</div>
            </div>

            <div className="flex items-center">
              {user ? (
                <button
                  onClick={handleDashboardClick}
                  className="bg-primary cursor-pointer text-background px-6 py-1.5 rounded-lg text-base transition-colors ml-3 font-medium"
                >
                  Dashboard
                </button>
              ) : (
                <button
                  onClick={handleTryForFree}
                  className="bg-primary cursor-pointer text-background px-6 py-1.5 rounded-lg text-base transition-colors ml-3 font-medium"
                >
                  Try for Free
                </button>
              )}

            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl min-h-[calc(100vh-10rem)] flex">
        {/* Left Panel - Callout */}
        <div className="flex-1 flex flex-col justify-center px-8 py-12">
          <div className="max-w-lg text-center">
            <h1 className="text-5xl font-tiempos-medium font-bold text-primary mb-6 leading-tight">
              Made for the <br></br> <CyclingScrambleText texts={networkerTexts} />.
            </h1>
            <p className="text-lg text-secondary mb-12 leading-relaxed">
              The AI for people searching, email finding, <br></br>and outreach tracking
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
                <LoginButton expanded={true} />
              )}
            </div>
          </div>
        </div>

        {/* Right Panel - Blue Square */}
        <div 
          className="w-1/2 bg-[#1E67B5] flex items-center justify-center rounded-xl relative overflow-hidden"
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

      <div className="mx-auto max-w-7xl pt-24 min-h-[calc(100vh-10rem)] flex flex-col items-center justify-center pb-12">

        <div className="flex-1 flex flex-col justify-center px-8 py-6 text-center">
          <h2 className="text-4xl font-bold text-primary mb-6 font-tiempos-medium">Networking, but 20x faster.</h2>
          <p className="max-w-lg text-lg text-secondary mb-12 leading-relaxed">
            Linkmail helps you level up your networking and outreach – find more jobs, outreach more people, send more follow ups.
          </p>
        </div>

        <div className="flex flex-col w-full items-stretch justify-center">
          {/* Left: Video Demo */}
          <div className="flex-1 flex flex-col justify-center items-center px-12 py-4">
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
          <div className="flex-1 flex flex-col justify-center items-center py-4 mt-12">
            <div className="flex w-full max-w-5xl gap-8">
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
                <div key={idx} className="w-1/3 my-8 last:mb-0">
                  <div className=" mb-4">{feature.icon}</div>
                  <h3 className="text-2xl font-semibold text-primary font-tiempos-regular mb-2 flex items-center gap-2">
                    {feature.title}
                  </h3>
                  <p className="text-md text-tertiary mt-6">{feature.content}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

      
      </div>


    </div>

    <footer className="w-full bg-black text-white px-12 py-10 mt-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4 px-4">
        {/* Left: Logo and name */}
        <div className="flex items-center gap-4">
          <img src="/logo.png" alt="LinkMail Logo" className="w-6 h-6" />
          <span className="font-semibold text-base">LinkMail</span>
          <p className="text-center text-xs flex-1 text-white/45">
            &copy; {new Date().getFullYear()} Linkmail AI
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-6">
          <a href="/about" className="text-xs hover:underline transition-colors">About Us</a>
          <a href="/privacy" className="text-xs hover:underline transition-colors">Privacy Policy</a>
          <a href="/contact" className="text-xs hover:underline transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
            
    </div>
  );
}
