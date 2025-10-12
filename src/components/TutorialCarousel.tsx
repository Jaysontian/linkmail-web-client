'use client';

import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
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
}

interface TutorialCarouselProps {
  isOpen: boolean;
  onClose: () => void;
}

export function TutorialCarousel({ isOpen, onClose }: TutorialCarouselProps) {
  const [currentStep, setCurrentStep] = useState(0);

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
        window.open('https://chromewebstore.google.com/detail/linkmail/jkidcmbkofimgdindkagdpdcioighhji', '_blank');
      },
      image: '/demo_small.webm'
    },
    {
      id: 3,
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
      id: 4,
      title: "Your Relationship OS",
      description: "Every contact, email, and note is saved to your Linkmail dashboard. Track follow-ups, manage conversations, and let your AI remind you when to reconnect or send thoughtful updates.",
      needButton: false,
      buttonText: "",
      buttonAction: () => {},
      image: '/tutorial_network.png'
    },
    {
      id: 5,
      title: "Ready to Master Outreach?",
      description: "You're all set. Find contacts, craft the perfect message, and build lasting connections — all powered by Linkmail.",
      needButton: true,
      buttonText: "Let's Begin",
      buttonAction: onClose,
      image: '/tutorial_last.png'
    }
  ];

  const nextStep = () => {
    setCurrentStep((prev) => (prev + 1) % tutorialSteps.length);
  };

  const prevStep = () => {
    setCurrentStep((prev) => (prev - 1 + tutorialSteps.length) % tutorialSteps.length);
  };

  const goToStep = (step: number) => {
    if (step === currentStep) return;
    setCurrentStep(step);
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
            <div className="w-full lg:w-1/2 relative h-64 lg:h-auto lg:min-h-96 overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ scale: 1.05, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.95, opacity: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.16, 1, 0.3, 1]
                  }}
                  className="w-full h-full"
                >
                  {currentTutorial.image.endsWith('.webm') || currentTutorial.image.endsWith('.mp4') ? (
                    <video
                      src={currentTutorial.image}
                      className="w-full h-full object-cover"
                      autoPlay
                      loop
                      muted
                      playsInline
                    />
                  ) : (
                    <Image
                      src={currentTutorial.image}
                      alt={currentTutorial.title}
                      fill
                      className="object-cover"
                      priority
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
                        className="w-fit mt-6 bg-opposite hover:bg-opposite/85 text-white font-medium py-2 px-4 rounded-lg cursor-pointer text-sm"
                        initial={{ opacity: 0, y: 5 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2, duration: 0.3 }}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
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
                  whileHover={{ scale: currentStep === 0 ? 1 : 1.05 }}
                  whileTap={{ scale: currentStep === 0 ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <ChevronLeft className="h-3 w-3" />
                  <span className="hidden sm:inline">Previous</span>
                </motion.button>

                <motion.button
                  onClick={nextStep}
                  disabled={currentStep === tutorialSteps.length - 1}
                  className="flex items-center gap-1 px-2 py-1 rounded-md border border-border hover:bg-hover cursor-pointer disabled:opacity-0 disabled:cursor-not-allowed text-xs text-secondary"
                  style={{ minWidth: 0 }}
                  whileHover={{ scale: currentStep === tutorialSteps.length - 1 ? 1 : 1.05 }}
                  whileTap={{ scale: currentStep === tutorialSteps.length - 1 ? 1 : 0.95 }}
                  transition={{ type: "spring", stiffness: 400, damping: 25 }}
                >
                  <span className="hidden sm:inline">Next</span>
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
