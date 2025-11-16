'use client';

import { Suspense, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { getOAuthUrl } from '@/lib/api';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import AnimatedPathText from '@/components/fancy/text/text-along-path';
import Float from '@/components/fancy/blocks/float';

const CHROME_WEB_STORE_URL = 'https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa';

function SignInContent() {
  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const handleSignIn = () => {
    // Get referral code from localStorage if present
    const ref = localStorage.getItem('linkmail_referral_code');
    
    // Redirect to backend OAuth flow with referral code
    let oauthUrl = getOAuthUrl();
    if (ref) {
      oauthUrl += `&ref=${ref}`;
    }
    
    // Also check for ref in URL params (in case it's passed directly)
    const urlRef = searchParams.get('ref');
    if (urlRef) {
      localStorage.setItem('linkmail_referral_code', urlRef);
      oauthUrl += `&ref=${urlRef}`;
    }
    
    window.location.href = oauthUrl;
  };

  const handleDownload = () => {
    window.open(CHROME_WEB_STORE_URL, '_blank');
  };

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
    <div className="min-h-screen bg-background px-4 sm:px-6 lg:px-8 py-2">
      <Header onTryForFree={handleDownload} />
      
      <main className="mx-auto max-w-7xl min-h-[calc(100vh-10rem)] flex flex-col lg:flex-row">
        {/* Left Panel - Sign In Content */}
        <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="max-w-lg mx-auto lg:mx-0 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-tiempos-medium font-bold text-primary mb-4 lg:mb-6 leading-tight">
              Welcome
            </h1>
            <p className="text-base sm:text-lg text-secondary mb-8 lg:mb-12 leading-relaxed">
              Sign in to access your dashboard and continue managing your outreach, connections, and templates.
            </p>
            
            <div className="flex flex-col items-center lg:items-start gap-4 mb-8">
              <button
                onClick={handleSignIn}
                className="flex items-center justify-center px-8 py-3 bg-background text-primary font-medium border-2 border-border rounded-lg hover:bg-hover hover:border-primary/50 cursor-pointer transition-all shadow-md w-full sm:w-auto"
              >
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Google_Favicon_2025.svg/250px-Google_Favicon_2025.svg.png"
                  alt="Google"
                  className="inline-block w-5 h-5 mr-3 align-middle"
                  style={{ verticalAlign: "middle" }}
                />
                Sign in with Google
              </button>
            </div>
            
            <div className="pt-6 border-t border-border">
              <p className="text-sm text-secondary mb-2">
                New to Linkmail?
              </p>
              <button
                onClick={handleDownload}
                className="text-primary font-medium hover:text-primary/80 cursor-pointer transition-colors inline-flex items-center gap-2"
              >
                <img
                  src="/chrome.png"
                  alt="Chrome"
                  className="w-4 h-4"
                />
                Download the extension
              </button>
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
      
      <Footer />
    </div>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <SignInContent />
    </Suspense>
  );
}

