'use client';

import { X, Download } from 'lucide-react';

interface TutorialProps {
  showExtensionCallout: boolean;
  onDismiss: () => void;
}

export function Tutorial({ showExtensionCallout, onDismiss }: TutorialProps) {
  if (!showExtensionCallout) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 backdrop-blur-[4px] z-50" onClick={onDismiss} />
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div role="dialog" aria-modal="true" className="w-full max-w-md rounded-xl border border-border bg-foreground shadow-xl">
          <div className="p-4 flex items-start justify-between">
            <div className="pr-6">
              <h3 className="text-base font-semibold text-primary">Install the Linkmail extension</h3>
              <p className="mt-1 text-sm text-secondary">
                Use Linkmail directly on LinkedIn profiles and inbox to send instantly.
              </p>
            </div>
            <button aria-label="Close" onClick={onDismiss} className="p-1 rounded-md hover:bg-hover cursor-pointer">
              <X className="h-5 w-5 text-secondary" />
            </button>
          </div>
          <div className="px-4 pb-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <a
                href="https://chrome.google.com/webstore/category/extensions"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-amber-600 text-white text-sm font-medium hover:bg-amber-700 transition-colors cursor-pointer flex-1"
                onClick={onDismiss}
              >
                <Download className="h-4 w-4" /> Install for Chrome
              </a>
              <a
                href="https://addons.mozilla.org/en-US/firefox/extensions/"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-hover text-primary text-sm font-medium hover:bg-selection transition-colors cursor-pointer flex-1"
                onClick={onDismiss}
              >
                Install for Firefox
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
