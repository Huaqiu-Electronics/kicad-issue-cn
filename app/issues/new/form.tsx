'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/app/hooks/useI18n';

const KICAD_ISSUE_TEMPLATE = `# Description


# Steps to reproduce
1. 
2. 

# KiCad Version
\`\`\`
\`\`\``;

export default function NewIssueForm() {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(KICAD_ISSUE_TEMPLATE);
  const [labels, setLabels] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    setError('');
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title,
          description: description || undefined,
          labels: labels ? labels.split(',').map(l => l.trim()) : undefined,
        }),
      });

      if (response.ok) {
        router.push('/issues');
      } else {
        const data = await response.json();
        setError(data.error || '创建问题失败');
      }
    } catch (error) {
      console.error('错误:', error);
      setError('创建问题失败，请重试');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/issues" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('issue_new.back')}
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        {/* Left: Tips Card */}
        <div>
          {/* Tips Card */}
          <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
            <div className="bg-primary text-primary-foreground px-4 py-3">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <h3 className="text-sm font-bold">{t('issue_new.tips')}</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>{t('issue_new.tip_1')}</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>{t('issue_new.tip_2')}</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>{t('issue_new.tip_3')}</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>{t('issue_new.tip_4')}</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  {t('issue_new.tip_5')}
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  {t('issue_new.tip_6')}
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Right: Main content + Sidebar cards */}
        <div className="lg:col-span-4 grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main form */}
          <div className="lg:col-span-3">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              {/* Header */}
              <div className="border-b border-border px-6 py-4">
                <h1 className="text-2xl font-bold text-card-foreground">{t('issue_new.title')}</h1>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <strong className="font-bold">{t('issue_new.error')}</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                )}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-card-foreground mb-2">
                    {t('issue_new.issue_title')}
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-xl bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all text-lg"
                    placeholder="请输入问题标题"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-card-foreground mb-2">
                    {t('issue_new.issue_description')}
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* Toolbar placeholder */}
                    <div className="bg-muted border-b border-border px-3 py-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">{t('issue_new.markdown_supported')}</span>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 bg-card text-card-foreground focus:ring-0 border-0 font-mono text-sm placeholder-muted-foreground"
                      placeholder={t('issue_new.placeholder_description')}
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Sidebar cards: 操作, 标签 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">{t('issue_new.actions')}</h3>
              </div>
              <div className="p-4 space-y-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim()}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? t('issue_new.creating') : t('issue_new.create_issue')}
                </button>
                <Link
                  href="/issues"
                  className="w-full block text-center px-4 py-2 border border-border text-card-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  {t('issue_new.cancel')}
                </Link>
              </div>
            </div>
            
            {/* Labels */}
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">{t('issue_new.labels')}</h3>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-xl bg-card text-card-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder={t('issue_new.labels_placeholder')}
                />
                <p className="mt-1 text-xs text-muted-foreground">{t('issue_new.labels_hint')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
