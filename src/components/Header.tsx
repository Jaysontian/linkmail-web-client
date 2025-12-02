'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { getOAuthUrl } from '@/lib/api';

interface HeaderProps {
  /** Custom handler for the "Try for Free" button when user is not logged in */
  onTryForFree?: () => void;
  /** Custom text for the action button when user is not logged in */
  tryForFreeText?: string;
  /** Custom className for the header element */
  className?: string;
}

export function Header({ onTryForFree, tryForFreeText = 'Download Now', className }: HeaderProps) {
  const { user } = useAuth();
  const router = useRouter();

  const handleDashboardClick = () => {
    router.push('/dashboard');
  };

  const handleTryForFree = () => {
    if (onTryForFree) {
      onTryForFree();
    } else {
      // Default behavior: Get referral code from localStorage if present
      const ref = localStorage.getItem('linkmail_referral_code');
      
      // Redirect to backend OAuth flow with referral code
      let oauthUrl = getOAuthUrl();
      if (ref) {
        oauthUrl += `&ref=${ref}`;
      }
      window.location.href = oauthUrl;
    }
  };

  return (
    <header className={className}>
      <div className="mx-auto max-w-7xl">
        <div className="flex justify-between items-center h-auto py-8">
          <div className="flex items-center">
            <img
              src="/logo.png"
              alt="Linkmail Logo"
              className="h-8 w-8 mr-3"
              style={{ objectFit: "contain" }}
            />
            <h1 className="text-lg sm:text-xl font-semibold font-tiempos-medium text-primary">Linkmail</h1>
            {/* <div className="text-xs text-primary ml-1 sm:ml-2 py-1 px-2 rounded-lg bg-accent-ultra-light">Beta</div> */}
          </div>

          <div className="flex items-center">
            {user ? (
              <button
                onClick={handleDashboardClick}
                className="bg-primary cursor-pointer text-background px-4 sm:px-6 py-1.5 rounded-lg text-sm sm:text-base transition-colors ml-2 sm:ml-3 font-medium"
              >
                Dashboard
              </button>
            ) : (
              <button
                onClick={handleTryForFree}
                className="bg-primary cursor-pointer text-background px-2 sm:px-4 py-1.5 rounded-lg text-sm sm:text-base transition-colors ml-2 sm:ml-3 font-medium flex items-center"
              >
                <img
                  src="/chrome.png"
                  alt="Chrome"
                  className="inline-block w-4 h-4 mr-2 align-middle"
                  style={{ verticalAlign: "middle" }}
                />
                {tryForFreeText}
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

