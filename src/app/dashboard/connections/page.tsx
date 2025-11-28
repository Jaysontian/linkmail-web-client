'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, User, Building, Search, Mail, Check, Clock, ArrowRight, ExternalLink } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { apiClient } from '@/lib/api';

interface Message {
  id: string;
  direction: 'sent' | 'received';
  subject: string;
  body: string;
  sent_at: string;
  gmail_message_id: string;
  gmail_thread_id: string;
  is_follow_up: boolean;
  attachments?: Array<{ name: string; size: number; type: string }>;
}

interface Connection {
  user_id: string;
  contact_id: number;
  subject: string;
  status: 'active' | 'closed' | 'follow_up_needed' | 'follow_up_sent' | 'responded' | 'meeting_scheduled' | 'converted';
  notes: string | null;
  messages: Message[];
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  job_title: string | null;
  company: string | null;
  linkedin_url: string | null;
  primary_email: string | null;
  profile_picture_url: string | null;
}

export default function FollowUpsPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const [connections, setConnections] = useState<Connection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [updatingStatus, setUpdatingStatus] = useState<number | null>(null);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      fetchConnections();
    }
  }, [isAuthenticated, isLoading]);

  const fetchConnections = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getConnections();
      
      if (!response.success) {
        throw new Error(response.error || 'Failed to fetch connections');
      }

      let connections: Connection[] = [];
      if (response.data && typeof response.data === 'object' && 'connections' in response.data) {
        const data = response.data as { connections?: unknown };
        if (Array.isArray(data.connections)) {
          connections = data.connections as Connection[];
        }
      }
      setConnections(connections);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsFollowUp = async (contactId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    
    try {
      setUpdatingStatus(contactId);
      const response = await apiClient.updateConnectionStatus(contactId, 'follow_up_sent');
      
      if (response.success) {
        // Update local state
        setConnections(prev => 
          prev.map(conn => 
            conn.contact_id === contactId 
              ? { ...conn, status: 'follow_up_sent', updated_at: new Date().toISOString() } 
              : conn
          )
        );
      }
    } catch (err) {
      console.error('Failed to update status:', err);
    } finally {
      setUpdatingStatus(null);
    }
  };

  const handleConnectionClick = (connectionId: number) => {
    router.push(`/dashboard/connections/${connectionId}`);
  };

  // Filter connections based on search
  const filteredConnections = connections.filter(conn => {
    const matchesSearch = searchQuery === '' || 
      `${conn.first_name} ${conn.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.company?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conn.primary_email?.toLowerCase().includes(searchQuery.toLowerCase());
    
    return matchesSearch;
  });

  // Separate and sort connections
  // Initial emails: status is 'active' (not follow_up_sent), sorted oldest to newest
  // Follow up sent: status is 'follow_up_sent', sorted oldest to newest
  const initialEmailConnections = filteredConnections
    .filter(conn => conn.status !== 'follow_up_sent')
    .sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());

  const followUpConnections = filteredConnections
    .filter(conn => conn.status === 'follow_up_sent')
    .sort((a, b) => new Date(a.updated_at).getTime() - new Date(b.updated_at).getTime());

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getInitialEmailDate = (conn: Connection) => {
    // Get the first message date, or fall back to created_at
    if (conn.messages && conn.messages.length > 0) {
      const sortedMessages = [...conn.messages].sort(
        (a, b) => new Date(a.sent_at).getTime() - new Date(b.sent_at).getTime()
      );
      return sortedMessages[0].sent_at;
    }
    return conn.created_at;
  };

  if (isLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  if (error) {
    return (
      <div className="p-6">
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <p className="text-red-800">Error: {error}</p>
          <button 
            onClick={fetchConnections}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  const ConnectionCard = ({ connection, isFollowUp }: { connection: Connection; isFollowUp: boolean }) => {
    const emailDate = isFollowUp ? connection.updated_at : getInitialEmailDate(connection);
    
    return (
      <div
        onClick={() => handleConnectionClick(connection.contact_id)}
        className="bg-foreground border border-border rounded-xl p-4 hover:shadow-md transition-all duration-200 cursor-pointer group"
      >
        <div className="flex items-start gap-4">
          {/* Profile Image */}
          <div className="w-12 h-12 bg-background rounded-full flex items-center justify-center overflow-hidden border border-border flex-shrink-0">
            {connection.profile_picture_url ? (
              <img 
                src={connection.profile_picture_url} 
                alt={`${connection.first_name} ${connection.last_name}`}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <User className="h-6 w-6 text-tertiary" />
            )}
          </div>

          {/* Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0">
                <h3 className="text-base font-semibold text-primary truncate">
                  {connection.first_name} {connection.last_name}
                </h3>
                <p className="text-sm text-secondary truncate">
                  {connection.job_title && connection.company 
                    ? `${connection.job_title} @ ${connection.company}`
                    : connection.company || connection.job_title || connection.primary_email
                  }
                </p>
              </div>
              
              {/* LinkedIn Link */}
              {connection.linkedin_url && (
                <a
                  href={connection.linkedin_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="text-secondary hover:text-primary transition-colors flex-shrink-0"
                >
                  <ExternalLink className="h-4 w-4" />
                </a>
              )}
            </div>

            {/* Status Row */}
            <div className="flex items-center justify-between mt-3 pt-3 border-t border-border">
              <div className="flex items-center gap-2">
                {isFollowUp ? (
                  <>
                    <div className="flex items-center gap-1.5 text-emerald-600">
                      <Check className="h-4 w-4" />
                      <span className="text-xs font-medium">Follow Up Sent</span>
                    </div>
                    <span className="text-xs text-tertiary">on {formatDate(emailDate)}</span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-1.5 text-blue-600">
                      <Mail className="h-4 w-4" />
                      <span className="text-xs font-medium">Initial Email Sent</span>
                    </div>
                    <span className="text-xs text-tertiary">on {formatDate(emailDate)}</span>
                  </>
                )}
              </div>

              {/* Mark as Follow Up Button - only show for initial emails */}
              {!isFollowUp && (
                <button
                  onClick={(e) => handleMarkAsFollowUp(connection.contact_id, e)}
                  disabled={updatingStatus === connection.contact_id}
                  className="flex items-center gap-1 px-2 py-1 text-xs font-medium text-secondary hover:text-primary hover:bg-hover rounded-md transition-all disabled:opacity-50"
                >
                  {updatingStatus === connection.contact_id ? (
                    <div className="animate-spin rounded-full h-3 w-3 border-b border-current"></div>
                  ) : (
                    <>
                      <ArrowRight className="h-3 w-3" />
                      <span>Mark Follow Up Sent</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-3xl mx-auto p-6 pt-[100px]">
      {/* Header */}
      <div className="flex-1 pb-6">
        <h1 className="text-3xl font-tiempos-medium text-primary">
          Follow Ups
        </h1>
        <p className="mt-2 text-[15px] text-stone-500">
          Track your outreach and know when to follow up with your connections.
        </p>
      </div>

      {/* Search */}
      <div className="mb-6">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-secondary" />
          <input
            type="text"
            placeholder="Search contacts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border text-secondary border-border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-foreground"
          />
        </div>
      </div>

      {/* Empty State */}
      {filteredConnections.length === 0 && (
        <div className="text-center py-12">
          <MessageSquare className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-primary">No follow ups yet</h3>
          <p className="mt-1 text-sm text-gray-500">
            {searchQuery 
              ? 'Try adjusting your search.'
              : 'Start by sending your first email to create a follow up.'
            }
          </p>
        </div>
      )}

      {/* Initial Emails Section */}
      {initialEmailConnections.length > 0 && (
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="h-4 w-4 text-blue-600" />
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Awaiting Follow Up
            </h2>
            <span className="text-xs text-tertiary bg-hover px-2 py-0.5 rounded-full">
              {initialEmailConnections.length}
            </span>
          </div>
          <div className="space-y-3">
            {initialEmailConnections.map((connection) => (
              <ConnectionCard 
                key={`${connection.user_id}_${connection.contact_id}`} 
                connection={connection} 
                isFollowUp={false}
              />
            ))}
          </div>
        </div>
      )}

      {/* Follow Ups Sent Section */}
      {followUpConnections.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Check className="h-4 w-4 text-emerald-600" />
            <h2 className="text-sm font-semibold text-primary uppercase tracking-wide">
              Follow Up Sent
            </h2>
            <span className="text-xs text-tertiary bg-hover px-2 py-0.5 rounded-full">
              {followUpConnections.length}
            </span>
          </div>
          <div className="space-y-3">
            {followUpConnections.map((connection) => (
              <ConnectionCard 
                key={`${connection.user_id}_${connection.contact_id}`} 
                connection={connection} 
                isFollowUp={true}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
