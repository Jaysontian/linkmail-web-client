'use client';

import { useRouter, usePathname } from 'next/navigation';
import { Menu, X, Home, User, Mail, Users, FileText, PanelLeftClose, PanelLeftOpen, PanelLeft, LayoutDashboard, SquareUserRound, MessageSquare, CircleDotDashed, Download, X as XIcon } from 'lucide-react';
import { LoginButton } from './LoginButton';
import { useUserProfile } from '@/hooks/useUserProfile';
import { useState, useEffect } from 'react';

interface SidebarProps {
  expanded: boolean;
  onToggle: () => void;
}

export function Sidebar({ expanded, onToggle }: SidebarProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { profile, updateProfile } = useUserProfile();
  const [showExtensionCallout, setShowExtensionCallout] = useState(false);

  const navigation = [
    { name: 'Overview', href: '/dashboard', icon: Home },
    { name: 'Profile', href: '/dashboard/profile', icon: SquareUserRound },
    { name: 'Connections', href: '/dashboard/connections', icon: CircleDotDashed },
    { name: 'Templates', href: '/dashboard/templates', icon: FileText },
  ];

  const handleNavigation = (href: string) => {
    router.push(href);
  };

  // Check if extension callout should be shown
  useEffect(() => {
    if (profile) {
      const extensionCalloutDismissed = profile.preferences?.extensionCalloutDismissed;
      const hasClickedDownload = profile.preferences?.hasClickedDownload;
      
      // Show callout if not dismissed and user hasn't clicked download
      if (!extensionCalloutDismissed && !hasClickedDownload) {
        setShowExtensionCallout(true);
      }
    }
  }, [profile]);

  const handleDismissCallout = async () => {
    setShowExtensionCallout(false);
    
    if (profile) {
      try {
        await updateProfile({
          preferences: {
            ...profile.preferences,
            extensionCalloutDismissed: true
          }
        });
      } catch (err) {
        console.warn('Failed to update extension callout preference:', err);
      }
    }
  };

  const handleDownloadClick = async () => {
    if (profile) {
      try {
        await updateProfile({
          preferences: {
            ...profile.preferences,
            hasClickedDownload: true,
            extensionCalloutDismissed: true
          }
        });
      } catch (err) {
        console.warn('Failed to update download preference:', err);
      }
    }
    // Open extension link
    window.open('https://chromewebstore.google.com/detail/linkmail/gehgnliedpckenmdindaioghgkhnfjaa', '_blank');
  };

  return (
    <div className={`${expanded ? 'w-64 bg-foreground border border-border' : 'w-14 border border-transparent'} h-[calc(100dvh-1rem)] m-2 rounded-2xl transition-all duration-300 ease-in-out flex flex-col sticky top-2 z-50`}>
      {/* Sidebar Header */}
      <div className="flex items-center justify-between p-3 border-gray-200">
        {expanded && (
          <div className="flex items-center space-x-4">
             <img 
                src="/logo.png" 
                alt="LinkMail" 
                className="h-7 w-auto cursor-pointer"
                onClick={() => window.location.href = '/'}
              />
          </div>
        )}

        <button
          onClick={onToggle}
          className="p-1.5 rounded-md hover:bg-hover transition-colors cursor-pointer"
        >
          {expanded ? (
            <PanelLeftClose className="h-5 w-5 text-secondary" strokeWidth={1.25} />
          ) : (
            <PanelLeft className="h-5 w-5 text-secondary" strokeWidth={1.25} />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-2 space-y-1.5 pt-4">
        {navigation.map((item) => {
          const isActive = pathname === item.href;
          const Icon = item.icon;
          
          return (
            <button
              key={item.name}
              onClick={() => handleNavigation(item.href)}
              className={`w-full flex items-center px-2 py-1.5 text-sm rounded-md transition-colors cursor-pointer ${
                isActive
                  ? 'bg-selection text-primary'
                  : 'text-secondary hover:bg-hover hover:text-primary'
              }`}
            >
              <Icon className="h-5 w-5 flex-shrink-0 text-secondary" strokeWidth={1.5} />
              {expanded && <span className="ml-3">{item.name}</span>}
            </button>
          );
        })}
      </nav>

      {/* Extension Callout */}
      {showExtensionCallout && expanded && (
        <div className="p-2">
          <div className="bg-background border border-border rounded-xl p-3 mb-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <img
                    src="/chrome.png"
                    alt="Chrome"
                    className="h-4 w-4"
                    style={{ display: 'inline-block' }}
                  />
                  <span className="text-sm font-medium text-primary">
                    Download Extension
                  </span>
                </div>
                <p className="text-xs text-secondary my-2 mb-8">
                  Download the extension to use Linkmail in LinkedIn.
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={handleDownloadClick}
                    className="bg-opposite text-background text-xs px-2 py-1 rounded-md cursor-pointer transition-colors"
                  >
                    Download
                  </button>
                  <button
                    onClick={handleDismissCallout}
                    className="text-secondary text-xs px-2 py-1 rounded-md hover:bg-hover cursor-pointer transition-colors"
                  >
                    Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Footer */}
      <div className="p-2">
        <LoginButton expanded={expanded} />
      </div>
    </div>
  );
}
