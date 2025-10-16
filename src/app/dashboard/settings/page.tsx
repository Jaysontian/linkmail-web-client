'use client';

import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CreditCard } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import Image from 'next/image';

export default function SettingsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('general');

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  const tabs = [
    { id: 'general', label: 'General', icon: User },
    { id: 'subscription', label: 'Subscription', icon: CreditCard },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 px-12 mt-[60px]">
      <div className="mb-8">
        <h1 className="text-4xl font-newsreader-500 text-primary">
          Settings
        </h1>
      </div>

      <div className="bg-transparent">

          <div className="flex flex-col lg:flex-row gap-8">

            {/* Side Navigation */}
            <div className="lg:w-64 flex-shrink-0">
              <nav className="space-y-2">
                {tabs.map((tab) => {
                  const Icon = tab.icon;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center cursor-pointer gap-3 px-4 py-3 text-left text-sm rounded-lg transition-all duration-200 ${
                        activeTab === tab.id
                          ? 'bg-selection text-primary'
                          : 'text-secondary hover:bg-selection hover:text-primary'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-sm">{tab.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Content Area */}
            <div className="flex-1 min-w-0">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                >
                  {activeTab === 'general' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-newsreader-500 text-primary mb-2">
                          General Settings
                        </h2>
                      </div>

                      <div className="space-y-6">
                        {/* Email Section */}
                        <div>
                          <p className="block text-md text-secondary mb-1 font-medium">
                            Email Address
                          </p>
                          <p className="mt-2 text-sm text-tertiary mb-4">
                            This is your primary email address used for account authentication.
                          </p>
                          <div className="relative">
                            <input
                              type="email"
                              value={user?.email || ''}
                              disabled
                              className="w-full px-3 py-2 text-md bg-foreground text-secondary border border-border rounded-lg opacity-75 cursor-not-allowed"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                              <span className="text-xs text-primary bg-background px-2 py-1 rounded border border-border">
                                Primary
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Account Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-md font-normal text-secondary mb-3">
                              First Name
                            </label>
                            <input
                              type="text"
                              value={user?.name?.split(' ')[0] || ''}
                              disabled
                              className="w-full px-3 py-2 text-md bg-foreground text-secondary border border-border rounded-lg opacity-75 cursor-not-allowed"
                            />
                          </div>
                          <div>
                            <label className="block text-md font-normal text-secondary mb-3">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={user?.name?.split(' ').slice(1).join(' ') || ''}
                              disabled
                              className="w-full px-3 py-2 text-md bg-foreground text-secondary border border-border rounded-lg opacity-75 cursor-not-allowed"
                            />
                          </div>
                        </div>

                        {/* Theme Settings */}
                        <div>
                          <label className="block text-md font-normal text-secondary mt-8 mb-2">
                            Choose Your Theme
                          </label>
                          <p className="text-sm mb-4 text-tertiary">
                            Select your preferred interface appearance
                          </p>
                          <div className="flex gap-4">
                              {/* Light Theme Option */}
                              <button
                                onClick={() => setTheme('light')}
                                className="relative p-2 rounded-lg transition-all duration-200 cursor-pointer"
                              >
                                <div
                                  className={`
                                    w-64 h-32 relative rounded-xl overflow-hidden border-2 transition-all duration-200
                                    ${theme === 'light'
                                      ? 'border-accent-light'
                                      : 'border-border hover:border-border'}
                                  `}
                                >
                                  <Image
                                    src="/light.png"
                                    alt="Light Theme"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="mt-2 text-center">
                                  <span className="text-xs font-medium text-secondary">Light</span>
                                </div>
                              </button>

                              {/* Dark Theme Option */}
                              <button
                                onClick={() => setTheme('dark')}
                                className={`
                                  relative p-2 rounded-lg transition-all duration-200 cursor-pointer
                                `}
                              >
                                <div
                                  className={`
                                    w-64 h-32 relative rounded-xl overflow-hidden border-2 transition-all duration-200
                                    ${theme === 'dark'
                                      ? 'border-accent-light'
                                      : 'border-border hover:border-border'}
                                  `}
                                >
                                  <Image
                                    src="/dark.png"
                                    alt="Dark Theme"
                                    fill
                                    className="object-cover"
                                  />
                                </div>
                                <div className="mt-2 text-center">
                                  <span className="text-xs font-medium text-secondary">Dark</span>
                                </div>
                              </button>
                            </div>
                        </div>

                        
                      </div>
                    </div>
                  )}

                  {activeTab === 'subscription' && (
                    <div className="space-y-6">
                      <div>
                        <h2 className="text-2xl font-newsreader-500 text-primary mb-2">
                          Subscription
                        </h2>
                        <p className="text-secondary text-sm mb-6">
                          Manage your subscription and billing information.
                        </p>
                      </div>

                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-foreground rounded-full flex items-center justify-center mb-4">
                          <CreditCard className="w-12 h-12 text-secondary" />
                        </div>
                        <h3 className="text-lg font-medium text-primary mb-2">
                          Subscription Management
                        </h3>
                        <p className="text-tertiary max-w-md mx-auto">
                          Subscription features will be available soon. Check back later to manage your plan and billing.
                        </p>
                      </div>
                    </div>
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
    </div>
  );
}



