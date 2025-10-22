'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { ChevronRight, Flame } from 'lucide-react';
import { useConnections } from '@/hooks/useConnections';
import { TutorialCarousel } from '@/components/TutorialCarousel';

export default function Dashboard() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const { profile, isLoading: profileLoading, getProfileSetupStatus, updateProfile } = useUserProfile();
  const router = useRouter();
  const { count: reachoutCount, isLoading: connectionsLoading } = useConnections();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    // Check if we have a token in the URL (from OAuth callback)
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    
    if (token && !isLoading) {
      // Show success message briefly, then stay on dashboard
      setShowSuccess(true);
      
      // Clear the token from URL
      window.history.replaceState({}, document.title, window.location.pathname);
      
      // Hide success message after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
      }, 3000);
    } else if (!isLoading && !isAuthenticated) {
      // No token and not authenticated, redirect to home
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Auto-open tutorial based on user preferences
  useEffect(() => {
    if (!isLoading && !profileLoading && isAuthenticated && profile) {
      // Check if user has seen tutorial in preferences
      const tutorialSeen = profile.preferences?.tutorialSeen;
      
      // Show tutorial if preferences is null or tutorialSeen is not true
      if (profile.preferences === null || tutorialSeen !== true) {
        setShowTutorial(true);
      }
    }
  }, [isLoading, profileLoading, isAuthenticated, profile]);

  const handleTutorialClose = async () => {
    setShowTutorial(false);
    
    // Update user preferences using existing updateProfile method
    if (profile) {
      try {
        await updateProfile({
          preferences: {
            ...profile.preferences,
            tutorialSeen: true
          }
        });
      } catch (err) {
        console.warn('Failed to update tutorial preference:', err);
      }
    }
  };


  if (isLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (showSuccess) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-green-50">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
            <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-green-900 mb-2">Sign In Successful!</h1>
          <p className="text-green-700 mb-4">Welcome back, {user?.name || 'User'}!</p>
          <p className="text-sm text-green-600">Setting up your dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto flex flex-col overflow-x-hidden pt-20">

        {/* Welcome Header */}
        <div className="w-full mb-4 pt-6 sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="text-sm text-secondary mb-8 mx-auto w-fit bg-foreground px-4 py-1 rounded-lg">Premium Tier ・ <a href="/dashboard/settings" className="hover:underline">Manage</a></div>
          <h1 className="text-4xl font-tiempos text-primary text-center flex-1 flex items-center justify-center">
            Welcome, {user?.name?.split(' ')[0] || 'there'}.
          </h1>
        </div>

        {/* Content area scrolls with page; header and composer remain sticky */}
        <div className="w-full px-0 pb-24 pt-2 mt-4">
          
          {/* Weekly Streak - moved from below */}
          {!connectionsLoading && (
            <div className="w-full sticky bottom-0 z-10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 pt-2 pb-4">
              <div className="relative w-full bg-foreground rounded-3xl p-5 overflow-hidden transition-all duration-300">
                <div className="flex items-center gap-6">
                  <div className="flex-1">
                    <div className="text-sm text-primary py-4">
                      <h2 className="text-base font-semibold pb-1">Weekly Streak</h2>
                      <p className="opacity-60 mb-4">Keep sending outreach and keep the momentum going!</p>
                      <button
                        type="button"
                        onClick={() =>
                          window.open(
                            'https://www.linkedin.com/feed/',
                            '_blank',
                            'noopener,noreferrer'
                          )
                        }
                        className="flex items-center bg-white/70 hover:bg-white/55 dark:bg-white/10 dark:hover:bg-white/20 cursor-pointer text-black/70 dark:text-slate-100 px-4 py-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        <img
                          src="/linkedin.png"
                          alt="LinkedIn"
                          className="w-4 h-4 mr-3"
                        />
                        <span className="inline-flex items-center gap-2">Open LinkedIn</span>
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col justify-center items-end px-3 py-2">
                    <div className="flex flex-row items-center">
                      <Flame
                        className="w-8 h-8 mr-1 text-transparent"
                        style={{
                          stroke: "none",
                          fill: "url(#flame-gradient)",
                        }}
                      />
                      <svg width="0" height="0">
                        <defs>
                          <linearGradient
                            id="flame-gradient"
                            x1="0%"
                            y1="0%"
                            x2="0%"
                            y2="100%"
                          >
                            <stop offset="0%" stopColor="#3b82f6" />
                            <stop offset="100%" stopColor="#6366f1" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <div className="text-4xl font-semibold text-primary leading-none">
                        {reachoutCount}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {(!profile || !getProfileSetupStatus().isSetupComplete) && (
            <div className="relative w-full bg-gradient-to-br from-blue-50 via-indigo-100 to-violet-100 dark:bg-gradient-to-br dark:from-[#204B9C] dark:via-[#162B69] dark:to-[#162B69] dark:border-slate-800 rounded-3xl p-4 mb-6 overflow-hidden group transition-all duration-300 mt-4">
              <div className="flex items-center gap-4">
                <div className="ml-2 flex-1">
                  <div className="mt-2 text-sm max-w-xl text-primary dark:text-white">
                    <h2 className="text-[12pt] font-bold text-primary pb-2">Personalize Your Profile</h2>
                    <p className="opacity-50 mr-4">Linkmail crafts the best email when you provide context on your professional background.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/dashboard/profile')}
                      className="bg-white/65 hover:bg-white/45 dark:bg-white/10 dark:hover:bg-white/20 cursor-pointer text-black/65 dark:text-slate-100 px-2 pl-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 group/button relative overflow-hidden"
                    >
                      <div className="relative z-10 flex items-center w-[100px]">
                        <div className="translate-x-2 group-hover/button:translate-x-0 w-fit line-clamp-1 transition-all duration-300 transform">
                          Edit Profile
                        </div>
                        <ChevronRight className="w-4 h-4 ml-2 opacity-0 group-hover/button:opacity-100" />
                      </div>
                    </button>
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="w-[100px] h-[100px] rounded-xl bg-white/75 dark:bg-white/10 from-blue-200/30 to-indigo-300/40 dark:from-slate-700/40 dark:to-slate-900/40 border border-white/20 dark:border-slate-700/40 shadow-lg group-hover:rotate-12 group-hover:-translate-y-2 group-hover:scale-105 transition-all duration-300 ease-out">
                    <div className="font-tiempos w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-2xl">
                      {getProfileSetupStatus().setupPercentage} <span className="font-serif ml-1">%</span> 
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Floating card that appears on hover */}
              <div className="absolute -bottom-6 -right-2 w-20 h-20 bg-white/15 dark:bg-white/10 backdrop-blur-sm rounded-lg border border-gray-200/50 dark:border-white/15 shadow-lg opacity-0 group-hover:opacity-100 group-hover:rotate-6 group-hover:-translate-y-1 transition-all duration-300 ease-out transform-gpu">
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-xs text-blue-700 font-medium text-center">
                    <div className="w-6 h-6 mx-auto mb-1 flex items-center justify-center">
                      <span className="text-xl">👫</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}


          </div>
          
          {/* Tutorial Carousel */}
          <TutorialCarousel 
            isOpen={showTutorial} 
            onClose={handleTutorialClose}
          />
    </div>
  );
}
