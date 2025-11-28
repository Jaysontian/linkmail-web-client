'use client';

import { useEffect, useState, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { getScheduledEmails, deleteScheduledEmail, updateScheduledEmail, ScheduledEmail } from '@/lib/api';

export function useScheduledEmails() {
  const { isAuthenticated, isLoading: authLoading, token } = useAuth();
  const [scheduledEmails, setScheduledEmails] = useState<ScheduledEmail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchScheduledEmails = useCallback(async () => {
    if (!isAuthenticated || authLoading || !token) return;
    
    try {
      setIsLoading(true);
      setError(null);
      const response = await getScheduledEmails(token);
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch scheduled emails');
      }
      
      const data = response.data;
      if (data && Array.isArray(data.scheduledEmails)) {
        setScheduledEmails(data.scheduledEmails);
      } else {
        setScheduledEmails([]);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [isAuthenticated, authLoading, token]);

  useEffect(() => {
    fetchScheduledEmails();
  }, [fetchScheduledEmails]);

  const cancelEmail = useCallback(async (emailId: number) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await deleteScheduledEmail(token, emailId);
      
      if (response.success) {
        // Remove from local state
        setScheduledEmails(prev => prev.filter(email => email.id !== emailId));
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Failed to cancel email' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [token]);

  const editEmail = useCallback(async (
    emailId: number,
    updates: { subject?: string; body?: string; scheduledAt?: string }
  ) => {
    if (!token) return { success: false, error: 'Not authenticated' };
    
    try {
      const response = await updateScheduledEmail(token, emailId, updates);
      
      if (response.success && response.data?.scheduledEmail) {
        // Update in local state
        setScheduledEmails(prev => prev.map(email => 
          email.id === emailId ? { ...email, ...response.data!.scheduledEmail } : email
        ));
        return { success: true };
      }
      
      return { success: false, error: response.error || 'Failed to update email' };
    } catch (err) {
      return { success: false, error: err instanceof Error ? err.message : 'An error occurred' };
    }
  }, [token]);

  const pendingEmails = scheduledEmails.filter(e => e.status === 'pending');
  const sentEmails = scheduledEmails.filter(e => e.status === 'sent');
  const failedEmails = scheduledEmails.filter(e => e.status === 'failed');

  return {
    scheduledEmails,
    pendingEmails,
    sentEmails,
    failedEmails,
    isLoading,
    error,
    refetch: fetchScheduledEmails,
    cancelEmail,
    editEmail
  };
}

