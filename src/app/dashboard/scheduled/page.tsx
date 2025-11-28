'use client';

import { useAuth } from '@/hooks/useAuth';
import { useScheduledEmails } from '@/hooks/useScheduledEmails';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { 
  Clock, 
  Calendar, 
  Trash2, 
  Edit3, 
  X, 
  Save, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  AlertCircle,
  RefreshCw 
} from 'lucide-react';
import { ScheduledEmail } from '@/lib/api';

function formatScheduledDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  // Format the date/time
  const timeString = date.toLocaleTimeString('en-US', { 
    hour: 'numeric', 
    minute: '2-digit',
    hour12: true 
  });
  const dateFormat = date.toLocaleDateString('en-US', { 
    weekday: 'short',
    month: 'short', 
    day: 'numeric',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
  });

  // Relative time description
  let relative = '';
  if (diffMs < 0) {
    relative = 'Overdue';
  } else if (diffMinutes < 60) {
    relative = `in ${diffMinutes} min`;
  } else if (diffHours < 24) {
    relative = `in ${diffHours} hr${diffHours > 1 ? 's' : ''}`;
  } else if (diffDays === 1) {
    relative = 'Tomorrow';
  } else if (diffDays < 7) {
    relative = `in ${diffDays} days`;
  }

  return relative ? `${dateFormat} at ${timeString} (${relative})` : `${dateFormat} at ${timeString}`;
}

function getStatusBadge(status: ScheduledEmail['status']) {
  switch (status) {
    case 'pending':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400">
          <Clock className="w-3 h-3" />
          Pending
        </span>
      );
    case 'sent':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">
          <CheckCircle2 className="w-3 h-3" />
          Sent
        </span>
      );
    case 'failed':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">
          <XCircle className="w-3 h-3" />
          Failed
        </span>
      );
    case 'cancelled':
      return (
        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          <X className="w-3 h-3" />
          Cancelled
        </span>
      );
  }
}

export default function ScheduledEmailsPage() {
  const { isLoading: authLoading, isAuthenticated } = useAuth();
  const { 
    scheduledEmails, 
    pendingEmails, 
    isLoading, 
    error, 
    refetch, 
    cancelEmail, 
    editEmail 
  } = useScheduledEmails();
  const router = useRouter();

  const [editingEmail, setEditingEmail] = useState<ScheduledEmail | null>(null);
  const [editDraft, setEditDraft] = useState<{ subject: string; body: string; scheduledAt: string }>({
    subject: '',
    body: '',
    scheduledAt: ''
  });
  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'pending' | 'all'>('pending');

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/signin');
    }
  }, [authLoading, isAuthenticated, router]);

  const openEditor = (email: ScheduledEmail) => {
    setEditingEmail(email);
    setEditDraft({
      subject: email.subject,
      body: email.body || '',
      scheduledAt: new Date(email.scheduled_at).toISOString().slice(0, 16) // Format for datetime-local input
    });
  };

  const closeEditor = () => {
    setEditingEmail(null);
    setEditDraft({ subject: '', body: '', scheduledAt: '' });
  };

  const handleSave = async () => {
    if (!editingEmail) return;
    setIsSaving(true);
    
    try {
      const result = await editEmail(editingEmail.id, {
        subject: editDraft.subject,
        body: editDraft.body,
        scheduledAt: new Date(editDraft.scheduledAt).toISOString()
      });
      
      if (result.success) {
        closeEditor();
      } else {
        alert(result.error || 'Failed to save changes');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (emailId: number) => {
    const confirmed = confirm('Are you sure you want to cancel this scheduled email?');
    if (!confirmed) return;
    
    setIsDeleting(emailId);
    try {
      const result = await cancelEmail(emailId);
      if (!result.success) {
        alert(result.error || 'Failed to cancel email');
      }
    } finally {
      setIsDeleting(null);
    }
  };

  if (authLoading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-secondary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const displayEmails = activeTab === 'pending' ? pendingEmails : scheduledEmails;

  return (
    <div className="max-w-3xl mx-auto py-6 px-6 mt-[100px]">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-tiempos-medium text-primary">Scheduled Emails</h1>
            <p className="mt-2 text-[15px] text-tertiary">
              View and manage your upcoming scheduled emails
            </p>
          </div>
          <button
            onClick={() => refetch()}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-border text-secondary text-sm hover:bg-hover cursor-pointer transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-4 mt-6">
          <div className="bg-foreground border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30">
                <Clock className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-primary">{pendingEmails.length}</p>
                <p className="text-xs text-tertiary">Pending</p>
              </div>
            </div>
          </div>
          <div className="bg-foreground border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-primary">
                  {scheduledEmails.filter(e => e.status === 'sent').length}
                </p>
                <p className="text-xs text-tertiary">Sent</p>
              </div>
            </div>
          </div>
          <div className="bg-foreground border border-border rounded-2xl p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                <Mail className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-semibold text-primary">{scheduledEmails.length}</p>
                <p className="text-xs text-tertiary">Total</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mt-6">
          <button
            onClick={() => setActiveTab('pending')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'pending'
                ? 'bg-primary text-background'
                : 'bg-foreground border border-border text-secondary hover:bg-hover'
            }`}
          >
            Pending ({pendingEmails.length})
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-colors cursor-pointer ${
              activeTab === 'all'
                ? 'bg-primary text-background'
                : 'bg-foreground border border-border text-secondary hover:bg-hover'
            }`}
          >
            All Emails ({scheduledEmails.length})
          </button>
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-2 text-red-700 dark:text-red-400">
            <AlertCircle className="w-5 h-5" />
            <p className="text-sm">{error}</p>
          </div>
        </div>
      )}

      {/* Email List */}
      {displayEmails.length === 0 ? (
        <div className="bg-foreground border border-border rounded-3xl p-10 text-center">
          <img
            src="/empty.png"
            alt="No scheduled emails"
            className="mx-auto my-10 w-20 h-20 opacity-70"
            style={{ objectFit: "contain" }}
          />
          <h3 className="text-lg font-medium text-primary mb-2">
            {activeTab === 'pending' ? 'No pending emails' : 'No scheduled emails'}
          </h3>
          <p className="text-sm text-tertiary">
            {activeTab === 'pending' 
              ? "You don't have any emails scheduled to be sent." 
              : "You haven't scheduled any emails yet."}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {displayEmails.map((email) => (
              <motion.div
                key={email.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="bg-foreground border border-border rounded-2xl p-5 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    {/* Status and Recipient */}
                    <div className="flex items-center gap-3 mb-2">
                      {getStatusBadge(email.status)}
                      <span className="text-sm text-secondary truncate">
                        To: {email.recipient_email}
                      </span>
                    </div>
                    
                    {/* Subject */}
                    <h3 className="text-base font-medium text-primary mb-2 line-clamp-1">
                      {email.subject || '(No subject)'}
                    </h3>
                    
                    {/* Scheduled Time */}
                    <div className="flex items-center gap-2 text-sm text-tertiary">
                      <Calendar className="w-4 h-4" />
                      <span>{formatScheduledDate(email.scheduled_at)}</span>
                    </div>
                  </div>

                  {/* Actions - Only show for pending emails */}
                  {email.status === 'pending' && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openEditor(email)}
                        className="p-2 rounded-lg text-secondary hover:text-primary hover:bg-hover cursor-pointer transition-colors"
                        title="Edit email"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(email.id)}
                        disabled={isDeleting === email.id}
                        className="p-2 rounded-lg text-secondary hover:text-red-500 hover:bg-red-500/10 cursor-pointer transition-colors disabled:opacity-50"
                        title="Cancel email"
                      >
                        {isDeleting === email.id ? (
                          <div className="w-4 h-4 border-2 border-red-500 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <Trash2 className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Edit Modal */}
      <AnimatePresence>
        {editingEmail && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={closeEditor} />
            <motion.div
              className="relative bg-background w-full max-w-2xl mx-4 rounded-2xl shadow-xl border border-border max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-tiempos-medium text-primary">Edit Scheduled Email</h3>
                    <p className="text-sm text-tertiary mt-1">
                      To: {editingEmail.recipient_email}
                    </p>
                  </div>
                  <button onClick={closeEditor} className="p-2 rounded-lg hover:bg-hover cursor-pointer">
                    <X className="w-4 h-4 text-tertiary" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-secondary mb-2">Subject</label>
                    <input
                      type="text"
                      value={editDraft.subject}
                      onChange={(e) => setEditDraft({ ...editDraft, subject: e.target.value })}
                      placeholder="Email subject"
                      className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-2">Body</label>
                    <textarea
                      rows={10}
                      value={editDraft.body}
                      onChange={(e) => setEditDraft({ ...editDraft, body: e.target.value })}
                      placeholder="Email body"
                      className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none whitespace-pre-wrap"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-2">Scheduled Date & Time</label>
                    <input
                      type="datetime-local"
                      value={editDraft.scheduledAt}
                      onChange={(e) => setEditDraft({ ...editDraft, scheduledAt: e.target.value })}
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 mt-6">
                  <button
                    onClick={closeEditor}
                    className="px-4 py-2 rounded-xl border border-border text-secondary text-sm hover:bg-hover cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 disabled:bg-primary/50 cursor-pointer"
                  >
                    <Save className="w-4 h-4" />
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

