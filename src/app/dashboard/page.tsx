'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { LoginButton } from '@/components/LoginButton';
import { ProfileSetup } from '@/components/ProfileSetup';
import { ChevronRight, Download, BookOpen, PencilRuler, Search, SendHorizonal, ArrowRight, ChevronDown, Bot, Plus, User, Building, Briefcase } from 'lucide-react';
import { generateDraft, saveTemplate, searchContacts } from '@/lib/api';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export default function Dashboard() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const { profile, isLoading: profileLoading, getProfileSetupStatus } = useUserProfile();
  const router = useRouter();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);
  const [mode, setMode] = useState<'draft' | 'find' | 'agent'>('draft');
  const [recipient, setRecipient] = useState<string | null>(null);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [isGeneratedView, setIsGeneratedView] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: 'user' | 'assistant'; content: string }>>([]);
  const [jobTitleQuery, setJobTitleQuery] = useState('');
  const [companyQuery, setCompanyQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState<Array<{ id: number; firstName: string; lastName: string; jobTitle: string | null; company: string | null; category: string | null; linkedinUrl: string | null }>>([]);
  const people = [
    { id: '1', name: 'Jane Cooper' },
    { id: '2', name: 'Devon Lane' },
    { id: '3', name: 'Courtney Henry' },
    { id: '4', name: 'Wade Warren' },
  ];

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

  // Auto-open tutorial on first visit
  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      try {
        const hasSeenTutorial = localStorage.getItem('linkmail_tutorial_seen');
        if (hasSeenTutorial !== 'true') {
          setShowTutorial(true);
        }
      } catch (err) {
        // If localStorage fails, show tutorial anyway
        setShowTutorial(true);
      }
    }
  }, [isLoading, isAuthenticated]);

  // Tutorial modal is now controlled globally in Providers


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
    <div className="max-w-xl mx-auto flex flex-col overflow-x-hidden">

          {/* Welcome Header */}
          <div className="w-full mb-4 pt-6 sticky top-0 z-10 bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="text-sm text-secondary mb-2 mx-auto w-fit bg-foreground px-4 py-1 rounded-lg mb-8">Premium Tier ・ <a href="/dashboard/settings" className="hover:underline">Manage</a></div>
            <h1 className="text-4xl font-tiempos text-primary text-center flex-1 flex items-center justify-center">
              {isGenerating
                ? 'Cooking...'
                : (isGeneratedView
                    ? `Here you go, ${user?.name?.split(' ')[0] || 'there'}`
                    : `Welcome, ${user?.name?.split(' ')[0] || 'there'}.`)}
            </h1>
          </div>

          {/* Content area scrolls with page; header and composer remain sticky */}
          <div className="w-full px-0 pb-24 pt-2">
          {isGeneratedView && (
            <div className="w-full mt-2 flex flex-col gap-3">
              {messages.map((m, idx) => {
                const isAssistant = m.role === 'assistant';
                const isLatestAssistant = isAssistant && messages.slice().reverse().find((mm) => mm.role === 'assistant') === m;
                return (
                  <div key={idx} className={`${isAssistant ? '' : 'flex justify-end'}`}>
                    <div className={`${isAssistant ? 'bg-foreground border border-border' : 'bg-opposite text-background'} rounded-3xl p-4 max-w-full w-full`}>
                      {isAssistant ? (
                        isLatestAssistant ? (
                          <div className="flex flex-col gap-2">
                            <textarea
                              className="w-full bg-transparent border-none outline-none text-primary placeholder:text-primary/50 resize-y min-h-[180px]"
                              value={draft || m.content}
                              onChange={(e) => setDraft(e.target.value)}
                              placeholder="Your drafted email..."
                              rows={8}
                            />
                            <div className="flex items-center justify-end">
                              <button
                                className="text-sm px-3 py-1.5 rounded-xl border border-border text-secondary hover:bg-secondary/10 cursor-pointer"
                                disabled={!draft?.trim() || !token}
                                onClick={async () => {
                                  if (!token || !draft) return;
                                  const currentTemplates = (profile?.templates as any) || [];
                                  const newTemplates = [
                                    ...currentTemplates,
                                    { content: draft, createdAt: new Date().toISOString() }
                                  ];
                                  await saveTemplate(token, newTemplates);
                                }}
                              >
                                Add as template
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="whitespace-pre-wrap text-primary">{m.content}</div>
                        )
                      ) : (
                        <div className="whitespace-pre-wrap">{m.content}</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}


          <div className="w-full sticky bottom-0 z-10 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70 pt-2 pb-4">
            <div className="bg-foreground border border-border w-full rounded-3xl p-4 flex flex-col gap-2 items-center">
              <textarea
                className="w-full bg-transparent border-none outline-none text-primary placeholder:text-primary/50 resize-none"
                placeholder="What are your trying to send out today?"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                rows={3}
              ></textarea>
              
              <div className="w-full flex flex-row gap-2 justify-between">

                <div className="flex flex-row gap-2"> 
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="flex flex-row gap-2 items-center bg-none border border-border text-sm text-secondary hover:bg-secondary/10 cursor-pointer px-2.5 py-1.5 rounded-xl transition">
                        {mode === 'draft' && <PencilRuler className="w-4 h-4" />}
                        {mode === 'find' && <Search className="w-4 h-4" />}
                        {mode === 'agent' && <Bot className="w-4 h-4" />}
                        <p>{mode === 'draft' ? 'Draft' : mode === 'find' ? 'Find' : 'Agent'}</p>
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="start" className="w-48" sideOffset={8}>
                      <DropdownMenuItem className="cursor-pointer" onSelect={() => setMode('draft')}>
                        <PencilRuler className="w-4 h-4 mr-2" />
                        Draft
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-not-allowed" disabled>
                        <Search className="w-4 h-4 mr-2" />
                        Find
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-border text-secondary">Coming soon</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem className="cursor-not-allowed" disabled>
                        <Bot className="w-4 h-4 mr-2" />
                        Agent
                        <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded-full bg-border text-secondary">Coming soon</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>

                </div>
                
                
                <button
                  className="bg-opposite hover:bg-opposite/80 disabled:opacity-60 disabled:cursor-not-allowed cursor-pointer text-background font-semibold rounded-lg transition p-2"
                  disabled={!input.trim() || isGenerating}
                  onClick={async () => {
                    if (!token) return;
                    try {
                      // stash initial state and navigate to chat page
                      const init = {
                        input: input.trim(),
                        messages: messages
                      };
                      sessionStorage.setItem('linkmail_chat_init', JSON.stringify(init));
                    } catch {}
                    router.push('/dashboard/chat');
                  }}
                >
                  {isGenerating ? (
                    <div className="h-4 w-4 border-2 border-background border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <ArrowRight className="w-4 h-4" />
                  )}
                </button>
                

              </div>
            </div>
          </div>

          


          {(!profile || !getProfileSetupStatus().isSetupComplete) && !isGeneratedView && (
            <div className="relative w-full bg-gradient-to-br from-blue-50 via-indigo-100 to-violet-100 border border-blue-100 dark:bg-gradient-to-br dark:from-[#204B9C] dark:via-[#162B69] dark:to-[#162B69] dark:border-slate-800 rounded-3xl p-4 mb-6 overflow-hidden group transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className="ml-3 flex-1">
                  <div className="mt-2 text-sm max-w-xl text-primary dark:text-white">
                    <h2 className="text-[12pt] font-bold text-primary pb-2">Personalize Your Profile</h2>
                    <p className="opacity-50 mr-4">Linkmail crafts the best email when you provide context on your professional background.</p>
                  </div>
                  <div className="mt-4">
                    <button
                      onClick={() => router.push('/dashboard/profile')}
                      className="bg-white/65 hover:bg-white/45 dark:bg-white/10 dark:hover:bg-white/20 cursor-pointer text-black/65 dark:text-slate-100 px-2 pl-4 py-2 rounded-2xl text-sm font-medium transition-all duration-300 group/button relative overflow-hidden"
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
                    <div className="w-full h-full flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-lg">
                      {getProfileSetupStatus().setupPercentage}%
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
    </div>
  );
}
