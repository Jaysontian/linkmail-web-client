'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function InstallRedirect() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const ref = searchParams.get('ref');
    
    if (ref) {
      // Store referral code in localStorage
      localStorage.setItem('linkmail_referral_code', ref);
      console.log('[InstallPage] Stored referral code:', ref);
    }
    
    // Redirect to homepage with ref parameter preserved
    const targetUrl = ref ? `/?ref=${ref}` : '/';
    router.replace(targetUrl);
  }, [searchParams, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
    </div>
  );
}

export default function InstallPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    }>
      <InstallRedirect />
    </Suspense>
  );
}

