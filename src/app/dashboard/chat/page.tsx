'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { ChevronDown, Bot, PencilRuler, Search, ArrowRight, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateDraft, saveTemplate } from '@/lib/api';
import { useSidebar } from '@/contexts/SidebarContext';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const { profile, updateProfile, fetchProfile } = useUserProfile();
  const router = useRouter();
  const { leftOffsetPx } = useSidebar();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [subject, setSubject] = useState<string>('');
  const [mode, setMode] = useState<'draft' | 'find' | 'agent'>('draft');
  const [thinkingMessage, setThinkingMessage] = useState<string>('');
  const [showNameDialog, setShowNameDialog] = useState(false);
  const [templateName, setTemplateName] = useState('');

  const thinkingMessages = [
    "cooking for you...",
    "drafting...",
    "brewing it up...",
    "crafting your message...",
    "thinking...",
    "writing magic..."
  ];

  const startThinking = () => {
    setIsGenerating(true);
    setThinkingMessage(thinkingMessages[Math.floor(Math.random() * thinkingMessages.length)]);
    
    // Cycle through messages every 1.5 seconds
    const interval = setInterval(() => {
      setThinkingMessage(prev => {
        const currentIndex = thinkingMessages.indexOf(prev);
        const nextIndex = (currentIndex + 1) % thinkingMessages.length;
        return thinkingMessages[nextIndex];
      });
    }, 1500);

    return () => clearInterval(interval);
  };

  useEffect(() => {
    try {
      const raw = sessionStorage.getItem('linkmail_chat_init');
      if (raw) {
        const parsed = JSON.parse(raw) as { input?: string; messages?: ChatMessage[] };
        const safeInput = (parsed?.input ?? '').toString();
        const safeMessages: ChatMessage[] = Array.isArray(parsed?.messages) ? parsed!.messages!.filter(Boolean) as ChatMessage[] : [];
        if (safeMessages.length > 0) setMessages(safeMessages);
        if (safeInput) setInput(safeInput);
        if (safeInput && token) {
          (async () => {
            const nextMessages: ChatMessage[] = [...safeMessages, { role: 'user', content: safeInput }];
            setMessages(nextMessages);
            const stopThinking = startThinking();
            const res = await generateDraft(token, { prompt: safeInput, context: { history: nextMessages } });
            if (res.success && res.data?.draft) {
              const assistantMsg = { role: 'assistant' as const, content: res.data.draft };
              setMessages([...nextMessages, assistantMsg]);
              setDraft(res.data.draft);
              setSubject(res.data.subject || '');
            }
            stopThinking();
            setIsGenerating(false);
            setThinkingMessage('');
            setInput('');
          })();
        }
      }
      sessionStorage.removeItem('linkmail_chat_init');
    } catch {}
  }, [token]);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  // Auto-resize textarea when draft content changes
  useEffect(() => {
    const textarea = document.querySelector('textarea[placeholder="Your drafted email..."]') as HTMLTextAreaElement;
    if (textarea && draft) {
      textarea.style.height = 'auto';
      textarea.style.height = textarea.scrollHeight + 'px';
    }
  }, [draft]);

  const handleSaveTemplate = async () => {
    if (!draft?.trim() || !templateName.trim() || !updateProfile) return;
    
    try {
      const currentTemplates = (profile?.templates as any[]) || [];
      const newTemplate = {
        icon: '📝',
        title: templateName.trim(),
        subject: subject.trim() || '',
        body: draft.trim(),
        file: null,
        strict_template: false
      };
      
      const updatedTemplates = [...currentTemplates, newTemplate];
      const result = await updateProfile({ templates: updatedTemplates });
      
      if (result.success) {
        await fetchProfile();
        // Navigate back to templates page
        router.push('/dashboard/templates');
      } else {
        alert('Failed to save template');
      }
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Failed to save template');
    } finally {
      setShowNameDialog(false);
      setTemplateName('');
    }
  };

  return (
    <div className="max-w-xl mx-auto flex flex-col overflow-x-hidden relative pt-20">
      {/* Top fade - fixed at top of page */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" style={{ left: leftOffsetPx }} />
      
      <div className="w-full px-0 pb-40 pt-2">
        <div className="w-full mt-2 flex flex-col gap-4">
          {messages.map((m, idx) => {
            const isAssistant = m.role === 'assistant';
            const isLatestAssistant = isAssistant && messages.slice().reverse().find(mm => mm.role === 'assistant') === m;
            return (
              <div key={idx} className={`${isAssistant ? '' : 'flex justify-end'}`}>
                <div className={`${isAssistant ? 'w-full bg-foreground py-4' : 'bg-accent text-primary w-fit py-2'} rounded-3xl px-4 max-w-full text-sm`}>
                  {isAssistant ? (
                    isLatestAssistant ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-secondary font-medium">Subject Line</label>
                          <input
                            type="text"
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-primary placeholder:text-primary/50 focus:outline-none focus:ring-2 focus:ring-primary"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            placeholder="Subject line..."
                          />
                        </div>
                        <div className="flex flex-col gap-2">
                          <label className="text-xs text-secondary font-medium">Email Body</label>
                          <textarea
                            className="w-full bg-background border border-border rounded-lg px-3 py-2 text-primary placeholder:text-primary/50 resize-none overflow-hidden focus:outline-none focus:ring-2 focus:ring-primary"
                            value={draft ?? m.content}
                            onChange={(e) => {
                              setDraft(e.target.value);
                              // Auto-resize textarea
                              e.target.style.height = 'auto';
                              e.target.style.height = e.target.scrollHeight + 'px';
                            }}
                            placeholder="Your drafted email..."
                            style={{ minHeight: '120px' }}
                          />
                        </div>
                        <div className="flex items-center justify-end">
                          <button
                            className="text-sm px-3 py-1.5 rounded-xl border border-border text-secondary hover:bg-secondary/10 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!draft?.trim() || !token}
                            onClick={() => {
                              if (!draft?.trim()) return;
                              setShowNameDialog(true);
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
          
          {/* Thinking indicator */}
          {isGenerating && thinkingMessage && (
            <div className="flex justify-start">
              <div className="w-full bg-foreground rounded-3xl p-2 px-4 max-w-full text-sm">
                <div className="flex items-center gap-2 text-primary/70">
                  <div className="flex space-x-1">
                    <div className="w-1 h-1 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-1 h-1 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1 h-1 bg-primary/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                  </div>
                  <span className="text-sm">{thinkingMessage}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Bottom fade - fixed above chat input */}
      <div className="fixed bottom-40 left-0 right-0 h-16 bg-gradient-to-t from-background to-transparent z-10 pointer-events-none" style={{ left: leftOffsetPx }} />
      
      <div className="fixed bottom-4 right-0 z-20 bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/70" style={{ left: leftOffsetPx }}>
        <div className="max-w-xl mx-auto px-4">
          <div className="bg-foreground border border-border w-full rounded-3xl p-4 flex flex-col gap-2 items-center">
          <textarea
            className={`w-full bg-transparent border-none outline-none text-primary placeholder:text-primary/50 resize-none transition-opacity ${isGenerating ? 'opacity-50' : ''}`}
            placeholder="Add feedback or ask for changes..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey && !isGenerating && input.trim()) {
                e.preventDefault();
                const currentInput = input.trim();
                setInput(''); // Clear textarea immediately
                const userMsg: ChatMessage = { role: 'user', content: currentInput };
                const nextMessages: ChatMessage[] = [...messages, userMsg];
                setMessages(nextMessages);
                setDraft(null);
                const stopThinking = startThinking();
                generateDraft(token!, { prompt: currentInput, context: { history: nextMessages } }).then((res) => {
                  if (res.success && res.data?.draft) {
                    const assistantMsg: ChatMessage = { role: 'assistant', content: res.data.draft };
                    setMessages([...nextMessages, assistantMsg]);
                    setDraft(res.data.draft);
                    setSubject(res.data.subject || '');
                  }
                  stopThinking();
                  setIsGenerating(false);
                  setThinkingMessage('');
                });
              }
            }}
            rows={3}
            disabled={isGenerating}
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
                const currentInput = input.trim();
                setInput(''); // Clear textarea immediately
                const userMsg: ChatMessage = { role: 'user', content: currentInput };
                const nextMessages: ChatMessage[] = [...messages, userMsg];
                setMessages(nextMessages);
                setDraft(null);
                const stopThinking = startThinking();
                const res = await generateDraft(token, { prompt: currentInput, context: { history: nextMessages } });
                if (res.success && res.data?.draft) {
                  const assistantMsg: ChatMessage = { role: 'assistant', content: res.data.draft };
                  setMessages([...nextMessages, assistantMsg]);
                  setDraft(res.data.draft);
                  setSubject(res.data.subject || '');
                }
                stopThinking();
                setIsGenerating(false);
                setThinkingMessage('');
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
      </div>

      {/* Template Name Dialog */}
      <AnimatePresence>
        {showNameDialog && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={() => setShowNameDialog(false)} />
            <motion.div
              className="relative bg-background w-full max-w-md mx-4 rounded-2xl shadow-xl border border-border"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-tiempos-medium text-primary">Name Your Template</h3>
                    <p className="text-sm text-tertiary mt-2">Give this template a memorable name</p>
                  </div>
                  <button onClick={() => setShowNameDialog(false)} className="p-2 rounded-lg hover:bg-hover cursor-pointer">
                    <X className="w-4 h-4 text-tertiary" />
                  </button>
                </div>

                <div className="mb-6">
                  <label className="block text-sm text-secondary mb-2">Template Name</label>
                  <input
                    type="text"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                    placeholder="e.g. Coffee Chat Request"
                    className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && templateName.trim()) {
                        handleSaveTemplate();
                      }
                    }}
                    autoFocus
                  />
                </div>

                <div className="flex items-center justify-end gap-3">
                  <button
                    onClick={() => {
                      setShowNameDialog(false);
                      setTemplateName('');
                    }}
                    className="px-4 py-2 rounded-xl border border-border text-secondary text-sm hover:bg-hover cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveTemplate}
                    disabled={!templateName.trim()}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:bg-primary/50 disabled:cursor-not-allowed cursor-pointer"
                  >
                    Continue
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}