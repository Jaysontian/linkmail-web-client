'use client';

import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { useEffect, useState } from "react";
import { TutorialCarousel } from "@/components/TutorialCarousel";

export function Providers({ children }: { children: React.ReactNode }) {
  const [isTutorialOpen, setIsTutorialOpen] = useState(false);

  useEffect(() => {
    const handleOpenTutorial = () => setIsTutorialOpen(true);
    window.addEventListener('openTutorial', handleOpenTutorial);
    return () => window.removeEventListener('openTutorial', handleOpenTutorial);
  }, []);

  return (
    <ThemeProvider>
      <AuthProvider>
        {children}
        <TutorialCarousel
          isOpen={isTutorialOpen}
          onClose={() => setIsTutorialOpen(false)}
        />
      </AuthProvider>
    </ThemeProvider>
  );
}
