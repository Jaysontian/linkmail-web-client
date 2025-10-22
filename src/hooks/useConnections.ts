'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export interface Connection {
  user_id: string;
  contact_id: number;
  first_name?: string | null;
  last_name?: string | null;
  company?: string | null;
  title?: string | null;
  linkedin_url?: string | null;
  status?: string | null;
  last_contacted_at?: string | null;
}

export function useConnections() {
  const { isAuthenticated, isLoading: authLoading, user, apiClient } = useAuth();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchConnections = async () => {
      if (!isAuthenticated || authLoading) return;
      try {
        setIsLoading(true);
        setError(null);
        const response = await apiClient.getConnections();
        if (!response.success) {
          throw new Error(response.error || 'Failed to fetch connections');
        }
        let list: Connection[] = [];
        const data: any = response.data;
        if (data && typeof data === 'object' && Array.isArray((data as any).connections)) {
          list = (data as any).connections as Connection[];
        }
        // If API returns all connections globally, filter by current user id
        if (user?.id) {
          list = list.filter((c) => c.user_id === user.id);
        }
        setConnections(list);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchConnections();
  }, [isAuthenticated, authLoading, apiClient, user?.id]);

  const count = useMemo(() => connections.length, [connections]);

  return { connections, count, isLoading, error };
}


