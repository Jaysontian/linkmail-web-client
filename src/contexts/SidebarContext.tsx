'use client';

import { createContext, useContext, useMemo } from 'react';

interface SidebarContextValue {
  expanded: boolean;
  leftOffsetPx: number;
  toggle: () => void;
}

const SidebarContext = createContext<SidebarContextValue | undefined>(undefined);

interface SidebarProviderProps {
  expanded: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

export function SidebarProvider({ expanded, onToggle, children }: SidebarProviderProps) {
  const value = useMemo<SidebarContextValue>(() => {
    // Tailwind widths mirror Sidebar component: expanded w-64 (256px), collapsed w-14 (~56px)
    const leftOffsetPx = expanded ? 256 + 16 : 56 + 16; // include sidebar margin (m-2 = 8px each side -> left gap ~16px total between window edge and main content start)
    return { expanded, leftOffsetPx, toggle: onToggle };
  }, [expanded, onToggle]);

  return <SidebarContext.Provider value={value}>{children}</SidebarContext.Provider>;
}

export function useSidebar() {
  const ctx = useContext(SidebarContext);
  if (!ctx) throw new Error('useSidebar must be used within SidebarProvider');
  return ctx;
}


