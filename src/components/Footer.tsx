'use client';

import React from 'react';

export function Footer() {
  return (
    <footer className="w-full text-white px-4 sm:px-8 lg:px-12 py-8 sm:py-10 mt-8 sm:mt-12">
      <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Left: Logo and name */}
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4">
          <div className="flex items-center gap-2 sm:gap-4">
            <img src="/logo.png" alt="LinkMail Logo" className="w-6 h-6" />
            <span className="font-semibold text-sm sm:text-base">Linkmail</span>
          </div>
          <p className="text-center text-xs text-white/45">
            &copy; {new Date().getFullYear()} Linkmail AI
          </p>
        </div>

        {/* Right: Links */}
        <div className="flex items-center gap-4 sm:gap-6">
          {/* <a href="/about" className="text-xs hover:underline transition-colors">About Us</a> */}
          <a href="/privacy" className="text-xs hover:underline transition-colors">Privacy Policy</a>
          <a href="mailto:jaysontian@g.ucla.edu" className="text-xs hover:underline transition-colors">Contact Us</a>
        </div>
      </div>
    </footer>
  );
}

