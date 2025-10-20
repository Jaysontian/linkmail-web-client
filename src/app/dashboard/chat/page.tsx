'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { ChevronDown, Bot, PencilRuler, Search, ArrowRight } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { generateDraft, saveTemplate } from '@/lib/api';
import { useSidebar } from '@/contexts/SidebarContext';

type ChatMessage = { role: 'user' | 'assistant'; content: string };

export default function ChatPage() {
  const { user, token, isLoading, isAuthenticated } = useAuth();
  const { profile } = useUserProfile();
  const router = useRouter();
  const { leftOffsetPx } = useSidebar();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [draft, setDraft] = useState<string | null>(null);
  const [mode, setMode] = useState<'draft' | 'find' | 'agent'>('draft');

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
            setIsGenerating(true);
            const nextMessages: ChatMessage[] = [...safeMessages, { role: 'user', content: safeInput }];
            setMessages(nextMessages);
            const res = await generateDraft(token, { prompt: safeInput, context: { history: nextMessages } });
            if (res.success && res.data?.draft) {
              const assistantMsg = { role: 'assistant' as const, content: res.data.draft };
              setMessages([...nextMessages, assistantMsg]);
              setDraft(res.data.draft);
            }
            setIsGenerating(false);
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

  return (
    <div className="max-w-xl mx-auto flex flex-col overflow-x-hidden relative pt-20">
      {/* Top fade - fixed at top of page */}
      <div className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-background to-transparent z-10 pointer-events-none" style={{ left: leftOffsetPx }} />
      
      <div className="w-full px-0 pb-40 pt-2">
        <div className="w-full mt-2 flex flex-col gap-3">
          {messages.map((m, idx) => {
            const isAssistant = m.role === 'assistant';
            const isLatestAssistant = isAssistant && messages.slice().reverse().find(mm => mm.role === 'assistant') === m;
            return (
              <div key={idx} className={`${isAssistant ? '' : 'flex justify-end'}`}>
                <div className={`${isAssistant ? 'w-full' : 'bg-foreground text-primary border border-border w-fit'} rounded-2xl p-2 px-4 max-w-full text-sm`}>
                  {isAssistant ? (
                    isLatestAssistant ? (
                      <div className="flex flex-col gap-2">
                        <textarea
                          className="w-full bg-transparent border-none outline-none text-primary placeholder:text-primary/50 min-h-[180px] resize-none"
                          value={draft ?? m.content}
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
                setIsGenerating(true);
                const userMsg: ChatMessage = { role: 'user', content: currentInput };
                const nextMessages: ChatMessage[] = [...messages, userMsg];
                setMessages(nextMessages);
                setDraft(null);
                generateDraft(token!, { prompt: currentInput, context: { history: nextMessages } }).then((res) => {
                  if (res.success && res.data?.draft) {
                    const assistantMsg: ChatMessage = { role: 'assistant', content: res.data.draft };
                    setMessages([...nextMessages, assistantMsg]);
                    setDraft(res.data.draft);
                  }
                  setIsGenerating(false);
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
                setIsGenerating(true);
                const userMsg: ChatMessage = { role: 'user', content: currentInput };
                const nextMessages: ChatMessage[] = [...messages, userMsg];
                setMessages(nextMessages);
                setDraft(null);
                const res = await generateDraft(token, { prompt: currentInput, context: { history: nextMessages } });
                if (res.success && res.data?.draft) {
                  const assistantMsg: ChatMessage = { role: 'assistant', content: res.data.draft };
                  setMessages([...nextMessages, assistantMsg]);
                  setDraft(res.data.draft);
                }
                setIsGenerating(false);
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
    </div>
  );
}