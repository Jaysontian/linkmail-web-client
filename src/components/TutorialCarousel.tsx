'use client';

import { useState, useEffect } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight, CircleArrowOutUpRight, X } from 'lucide-react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';

interface TutorialStep {
  id: number;
  title: string;
  description: string;
  needButton: boolean;
  buttonText: string;
  buttonAction: () => void;
  image: string;
  icon?: string;
}

interface TutorialCarouselProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialCarousel({ isOpen, onClose }: TutorialCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [imagesLoaded, setImagesLoaded] = useState<Set<number>>(new Set());
  const [isLoading, setIsLoading] = useState(false);

  // Reset to first step whenever the carousel opens
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(0);
      setImagesLoaded(new Set([0])); // Mark first image as loaded
    }
  }, [isOpen]);

  // Preload all tutorial images when carousel opens
  useEffect(() => {
    if (isOpen) {
      const preloadImages = async () => {
        const imagePromises = tutorialSteps.map((step, index) => {
          if (step.image.endsWith('.webm') || step.image.endsWith('.mp4')) {
            return Promise.resolve(); // Skip videos for now
          }
          
          return new Promise<void>((resolve) => {
            const img = new window.Image();
            img.onload = () => {
              setImagesLoaded(prev => new Set([...prev, index]));
              resolve();
            };
            img.onerror = () => resolve(); // Continue even if image fails
            img.src = step.image;
          });
        });
        
        await Promise.all(imagePromises);
      };
      
      preloadImages();
    }
  }, [isOpen]);

  const tutorialSteps: TutorialStep[] = [
    {
      id: 1,
      title: "The AI for modern networking",
      description: "Linkmail turns LinkedIn outreach into an art. It automatically finds verified emails, crafts the perfect message, and helps you track and build real professional relationships — fast.",
      needButton: false,
      buttonText: "Install Extension",
      buttonAction: () => {
        window.open('https://chromewebstore.google.com/detail/linkmail/jkidcmbkofimgdindkagdpdcioighhji', '_blank');
      },
      image: '/tutorial_1.png'
    },
    {
      id: 2,
      title: "Network Smarter, Not Harder",
      description: "Linkmail lives inside LinkedIn. On any profile, it automatically finds verified emails, analyzes each profile, and drafts a personalized message in your tone — and it sends it out right away.",
      needButton: true,
      buttonText: "Download Extension",
      buttonAction: () => {
        window.open('https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa', '_blank');
      },
      icon: '/chrome.png',
      image: '/tutorial_try.png'
    },
    {
      id: 3,
      title: "Send Your First Linkmail",
      description: "Now it's your turn! Send a real outreach email to Jayson in under 10 seconds. Just click below to try the full AI workflow on a real LinkedIn profile.",
      needButton: true,
      buttonText: "Send Jayson a Message",
      buttonAction: () => {
        window.open('https://www.linkedin.com/in/jaysontian/', '_blank');
      },
      icon: '/linkedin.png',
      image: '/demo_small.webm'
    },
    {
      id: 4,
      title: "Teach Linkmail Your Voice",
      description: "Customize your profile with your professional background and make custom templates. The AI learns how you communicate — so every outreach feels authentic, not robotic.",
      needButton: false,
      buttonText: "Try It Now",
      buttonAction: () => {
        window.open('https://www.linkedin.com', '_blank');
      },
      image: '/template-demo.webm'
    },
    {
      id: 5,
      title: "Your Relationship OS",
      description: "Every contact, email, and note is saved to your Linkmail dashboard. Track follow-ups, manage conversations, and let your AI remind you when to reconnect or send thoughtful updates.",
      needButton: false,
      buttonText: "",
      buttonAction: () => {},
      image: '/tutorial_network.png'
    },
    {
      id: 6,
      title: "Ready to Master Outreach?",
      description: "You're all set! Time to become a networking superhuman. You can always open this tutorial again from the sidebar menu by clicking your name.",
      needButton: true,
      buttonText: "Let's Begin",
      buttonAction: onClose,
      image: '/tutorial_last.png'
    }
  ];

  const nextStep = () => {
    const nextStepIndex = (currentStep + 1) % tutorialSteps.length;
    if (nextStepIndex !== currentStep) {
      setIsLoading(true);
      setCurrentStep(nextStepIndex);
      // Reset loading state after a brief delay to allow for smooth transition
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const prevStep = () => {
    const prevStepIndex = (currentStep - 1 + tutorialSteps.length) % tutorialSteps.length;
    if (prevStepIndex !== currentStep) {
      setIsLoading(true);
      setCurrentStep(prevStepIndex);
      setTimeout(() => setIsLoading(false), 100);
    }
  };

  const goToStep = (step: number) => {
    if (step === currentStep) return;
    setIsLoading(true);
    setCurrentStep(step);
    setTimeout(() => setIsLoading(false), 100);
  };

  const currentTutorial = tutorialSteps[currentStep];

  if (!isOpen) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeOut" }}
        className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-50"
        onClick={onClose}
      />
      
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ 
            duration: 0.4, 
            ease: [0.16, 1, 0.3, 1], // Custom spring easing
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="w-full max-w-4xl rounded-3xl border border-border shadow-xl overflow-hidden"
        >
          {/* Content */}
          <div className="flex flex-col lg:flex-row">
            {/* Left side - Image/Video */}
            <div className="w-full lg:w-1/2 relative h-64 lg:h-auto lg:min-h-96 overflow-hidden bg-gray-100 dark:bg-gray-800">
              {/* Loading skeleton */}
              {isLoading && (
                <div className="absolute inset-0 bg-gradient-to-r from-gray-200 via-gray-300 to-gray-200 dark:from-gray-700 dark:via-gray-600 dark:to-gray-700 animate-pulse" />
              )}
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 0.1, 
                    ease: "easeInOut"
                  }}
                  className="w-full h-full relative"
                >
                  {currentTutorial.image.endsWith('.webm') || currentTutorial.image.endsWith('.mp4') ? (
                    <video
                      src={currentTutorial.image}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                      preload="metadata"
                      poster={currentTutorial.image.replace('.webm', '.png').replace('.mp4', '.png')}
                    />
                  ) : (
                    <Image
                      src={currentTutorial.image}
                      alt={currentTutorial.title}
                      fill
                      className="object-cover"
                      priority={currentStep === 0}
                      quality={85}
                      sizes="(max-width: 768px) 100vw, 50vw"
                      onLoad={() => {
                        setImagesLoaded(prev => new Set([...prev, currentStep]));
                        setIsLoading(false);
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right side - All Content */}
            <div className="lg:w-1/2 flex flex-col bg-foreground">
              {/* Header */}
              <div className="flex items-center justify-between p-4">
                <div className="flex items-center gap-2 ml-2">
                  {/* Step indicators */}
                  <div className="flex items-center gap-2">
                    {tutorialSteps.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => goToStep(index)}
                        className={`w-1.5 h-1.5 rounded-full cursor-pointer ${
                          index === currentStep 
                            ? 'bg-accent' 
                            : 'bg-border hover:bg-secondary'
                        }`}
                        aria-label={`Go to step ${index + 1}`}
                        style={{ minWidth: 6, minHeight: 6 }}
                        whileHover={{ scale: 1.25 }}
                        whileTap={{ scale: 0.95 }}
                        animate={{ 
                          scale: index === currentStep ? 1.25 : 1 
                        }}
                        transition={{ 
                          type: "spring", 
                          stiffness: 400, 
                          damping: 25 
                        }}
                      />
                    ))}
                  </div>
                </div>
                <motion.button
                  onClick={onClose}
                  className="p-1.5 rounded-md hover:bg-hover cursor-pointer"
                  aria-label="Close tutorial"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <X className="h-4 w-4 text-secondary" />
                </motion.button>
              </div>

              {/* Text Content */}
              <div className="py-10 px-12 flex-1 flex flex-col justify-center min-h-96">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentStep}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ 
                      duration: 0.2, 
                      ease: [0.16, 1, 0.3, 1]
                    }}
                    className="max-w-md mx-auto lg:mx-0"
                  >
                    <motion.h2 
                      className="text-2xl font-tiempos-medium text-primary mb-3"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.1, duration: 0.3 }}
                    >
                      {currentTutorial.title}
                    </motion.h2>
                    <motion.p 
                      className="text-sm text-secondary mb-6 leading-5.5"
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.15, duration: 0.3 }}
                    >
                      {currentTutorial.description}
                    </motion.p>
                    {currentTutorial.needButton && (
                      <motion.button
                        onClick={currentTutorial.buttonAction}
                        className="w-fit mt-6 bg-black hover:bg-black/85 text-white font-medium py-2 px-4 rounded-lg cursor-pointer text-sm flex items-center gap-4"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.2 }}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {currentTutorial.icon ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={currentTutorial.icon} alt="Logo" className="h-5 w-5" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4" />
                        )}

                        {currentTutorial.buttonText} 
                        
                      </motion.button>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between p-4">
                <motion.button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border border-border hover:bg-hover cursor-pointer disabled:opacity-0 disabled:cursor-not-allowed text-xs text-secondary"
                  style={{ minWidth: 0 }}
                  whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span className="hidden sm:inline text-sm">Previous</span>
                </motion.button>

                <motion.button
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border border-border hover:bg-hover cursor-pointer disabled:opacity-0 disabled:cursor-not-allowed text-xs text-secondary"
                  style={{ minWidth: 0 }}
                  whileTap={{ scale: currentStep === tutorialSteps.length - 1 ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="hidden sm:inline text-sm">Next</span>
                  <ChevronRight className="h-3 w-3" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
