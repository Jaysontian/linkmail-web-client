'use client';

import { useAuth } from '@/hooks/useAuth';
import { useUserProfile, UserProfile } from '@/hooks/useUserProfile';
import { useRouter } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Plus, X, Save, Trash2, Edit3 } from 'lucide-react';

type TemplateItem = {
  icon?: string;
  name: string;
  title: string;
  body: string;
  fileUrl?: string | null;
  strict_template?: boolean;
};

export default function TemplatesPage() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const { profile, isLoading: profileLoading, updateProfile, fetchProfile } = useUserProfile();
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [draft, setDraft] = useState<TemplateItem | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push('/');
    }
  }, [isLoading, isAuthenticated, router]);

  const templates: TemplateItem[] = useMemo(() => {
    const raw = (profile?.templates as any[]) || [];
    return raw.map((t: any) => ({
      icon: t?.icon || '📝',
      name: t?.name || t?.title || 'Untitled Template',
      title: t?.title || '',
      body: t?.body || '',
      fileUrl: t?.fileUrl ?? null,
      strict_template: typeof t?.strict_template === 'boolean' ? t.strict_template : false,
    }));
  }, [profile?.templates]);

  const openEditor = (index: number | null) => {
    setSelectedIndex(index);
    if (index === null) {
      setDraft({ icon: '📝', name: '', title: '', body: '', fileUrl: null, strict_template: false });
    } else {
      setDraft({ ...templates[index] });
    }
  };

  const closeEditor = () => {
    setSelectedIndex(null);
    setDraft(null);
  };

  const handleSave = async () => {
    if (!draft) return;
    setIsSaving(true);
    try {
      const nextTemplates = [...templates];
      if (selectedIndex === null) {
        nextTemplates.push(draft);
      } else if (selectedIndex >= 0 && selectedIndex < nextTemplates.length) {
        nextTemplates[selectedIndex] = draft;
      }

      const result = await updateProfile({ templates: nextTemplates } as Partial<UserProfile>);
      if (!result.success) {
        alert('Failed to save template');
      } else {
        await fetchProfile();
        closeEditor();
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (index: number) => {
    const ok = confirm('Delete this template?');
    if (!ok) return;
    const next = templates.filter((_, i) => i !== index);
    const result = await updateProfile({ templates: next } as Partial<UserProfile>);
    if (!result.success) alert('Failed to delete');
    await fetchProfile();
    if (selectedIndex === index) closeEditor();
  };

  if (isLoading || profileLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto py-6 px-6 mt-[100px]">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-tiempos-medium text-primary">Templates</h1>
          <p className="mt-6 text-[15px] max-w-lg text-tertiary">Save and reuse outreach drafts for different purposes. Linkmail will base responses off of these templates.</p>
        </div>
        {templates.length !== 0 && <button
          onClick={() => openEditor(null)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-background text-sm font-medium hover:bg-primary/90 cursor-pointer"
        >
          <Plus className="w-4 h-4" /> New Template
        </button>}
      </div>

      {templates.length === 0 ? (
        <div className="bg-background border border-border rounded-3xl p-10 pb-20 text-center">
          <img
            src="/empty.png"
            alt="No templates"
            className="mx-auto my-10 w-20 h-20 opacity-70"
            style={{ objectFit: "contain" }}
          />
          <h3 className="text-lg font-medium text-primary mb-2">No templates yet</h3>
          <p className="text-sm text-tertiary mb-4">Create your first template to speed up outreach.</p>
          <button
            onClick={() => openEditor(null)}
            className="my-4 inline-flex items-center gap-2 px-3 py-1.5 rounded-lg font-medium bg-primary text-background cursor-pointer text-sm"
          >
            <Plus className="w-4 h-4" /> Create Template
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {templates.map((t, i) => (
            <div key={i} className="group bg-foreground border border-border rounded-xl p-4 shadow-sm hover:shadow-md transition cursor-pointer" onClick={() => openEditor(i)}>
              <div className="flex items-start justify-between mb-3">
                <div className="text-2xl leading-none">{t.icon || '📝'}</div>
                <button
                  onClick={(e) => { e.stopPropagation(); handleDelete(i); }}
                  className="p-1 text-tertiary hover:text-red-500 cursor-pointer rounded-md hover:bg-red-500/10"
                  aria-label="Delete template"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
              <div className="mb-4 font-medium text-primary line-clamp-1">{t.name || 'Untitled Template'}</div>
              <div className="text-xs text-tertiary line-clamp-4 whitespace-pre-wrap">{t.body}</div>
              {t.fileUrl && (
                <a
                  href={t.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                  className="inline-flex items-center gap-1 text-xs mt-3 text-primary hover:underline"
                >
                  Attachment
                  <Edit3 className="w-3 h-3" />
                </a>
              )}
            </div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {draft && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="absolute inset-0 bg-black/60" onClick={closeEditor} />
            <motion.div
              className="relative bg-background w-full max-w-2xl mx-4 rounded-2xl shadow-xl border border-border"
              initial={{ scale: 0.95, y: 10, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.98, y: 6, opacity: 0 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-tiempos-medium text-primary">{selectedIndex === null ? 'New Template' : 'Edit Template'}</h3>
                  </div>
                  <button onClick={closeEditor} className="p-2 rounded-lg hover:bg-hover cursor-pointer">
                    <X className="w-4 h-4 text-tertiary" />
                  </button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <label className="block text-sm text-secondary mb-2">Icon</label>
                      <input
                        type="text"
                        maxLength={2}
                        value={draft.icon || ''}
                        onChange={(e) => setDraft({ ...(draft as TemplateItem), icon: e.target.value })}
                        placeholder="e.g. 🔎"
                        className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="md:col-span-3">
                      <label className="block text-sm text-secondary mb-2">Template Name</label>
                      <input
                        type="text"
                        value={draft.name}
                        onChange={(e) => setDraft({ ...(draft as TemplateItem), name: e.target.value })}
                        placeholder="Short Reach Out"
                        className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-2">Subject Line</label>
                    <input
                      type="text"
                      value={draft.title}
                      onChange={(e) => setDraft({ ...(draft as TemplateItem), title: e.target.value })}
                      placeholder="Quick question about [Company]"
                      className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-secondary mb-2">Body</label>
                    <textarea
                      rows={10}
                      value={draft.body}
                      onChange={(e) => setDraft({ ...(draft as TemplateItem), body: e.target.value })}
                      placeholder={'Hi [Recipient Name], I\'m a 3rd year Computer Science student at UCLA...'}
                      className="w-full px-3 py-2 text-sm text-primary bg-foreground border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary whitespace-pre-wrap"
                    />
                  </div>

                  {/* Optional attachment URL field; file uploads can be added later */}
                  <div>
                    <label className="block text-sm text-secondary mb-2">Attachment URL (optional)</label>
                    <input
                      type="url"
                      value={draft.fileUrl || ''}
                      onChange={(e) => setDraft({ ...(draft as TemplateItem), fileUrl: e.target.value })}
                      placeholder="https://..."
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
                    <Save className="w-4 h-4" /> {isSaving ? 'Saving...' : 'Save Template'}
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


