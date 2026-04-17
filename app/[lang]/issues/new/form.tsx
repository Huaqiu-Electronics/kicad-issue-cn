'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';

interface NewIssueFormProps {
  user: any;
  lang: string;
}

export default function NewIssueForm({ user, lang }: NewIssueFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError(t('new_issue.error_required', '标题和描述不能为空'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(t('new_issue.success', '问题创建成功！'));
        // Redirect to the new issue page after a short delay
        setTimeout(() => {
          router.push(`/${lang}/issues/${data.gitlab_iid}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('new_issue.error', '创建问题失败'));
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      setError(t('new_issue.error', '创建问题失败'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6 text-card-foreground">{t('new_issue.title', '新建问题')}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
            {t('new_issue.title_label', '标题')}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder={t('new_issue.title_placeholder', '请输入问题标题')}
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
            {t('new_issue.description_label', '描述')}
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={8}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder={t('new_issue.description_placeholder', '请详细描述问题，包括复现步骤、预期结果和实际结果')}
          />
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t('new_issue.submitting', '提交中...') : t('new_issue.submit', '提交')}
          </button>
        </div>
      </form>
    </div>
  );
}
