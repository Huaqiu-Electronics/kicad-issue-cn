'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';

interface GuestIssueDetailContentProps {
  guestIssue: any;
  lang: string;
  user: any;
}

export default function GuestIssueDetailContent({ guestIssue, lang, user }: GuestIssueDetailContentProps) {
  const router = useRouter();
  const { t } = useI18n();
  const [title, setTitle] = useState(guestIssue.title);
  const [description, setDescription] = useState(guestIssue.description);
  const [labels, setLabels] = useState(guestIssue.labels || '');
  const [isSaving, setIsSaving] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSave = async () => {
    setIsSaving(true);
    setError('');
    try {
      const res = await fetch(`/api/guest-issues/${guestIssue.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, description, labels }),
      });

      if (res.ok) {
        setSuccess(t('guest_issue.save_success', 'Issue updated successfully'));
      } else {
        const data = await res.json();
        setError(data.error || t('guest_issue.save_error', 'Failed to update issue'));
      }
    } catch (err) {
      console.error('Error saving:', err);
      setError(t('guest_issue.save_error', 'Failed to update issue'));
    } finally {
      setIsSaving(false);
    }
  };

  const handleApprove = async () => {
    setIsApproving(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/guest-issues/${guestIssue.id}/approve`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        const data = await res.json();
        setSuccess(t('guest_issue.approve_success', 'Issue approved and posted to GitLab'));
        setTimeout(() => router.push(`/issues/${data.gitlabIid}`), 2000);
      } else {
        const data = await res.json();
        setError(data.error || t('guest_issue.approve_error', 'Failed to approve issue'));
      }
    } catch (err) {
      console.error('Error approving:', err);
      setError(t('guest_issue.approve_error', 'Failed to approve issue'));
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    setIsRejecting(true);
    setError('');
    try {
      const res = await fetch(`/api/admin/guest-issues/${guestIssue.id}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (res.ok) {
        setSuccess(t('guest_issue.reject_success', 'Issue rejected'));
        setTimeout(() => router.push(`/issues`), 2000);
      } else {
        const data = await res.json();
        setError(data.error || t('guest_issue.reject_error', 'Failed to reject issue'));
      }
    } catch (err) {
      console.error('Error rejecting:', err);
      setError(t('guest_issue.reject_error', 'Failed to reject issue'));
    } finally {
      setIsRejecting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-6">
        <Link href={`/issues`} className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          {t('issue_new.back', 'Back to issues')}
        </Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
        <div className="lg:col-span-3">
          <div className="bg-card border border-border rounded-2xl shadow-sm p-8">
            {error && (
              <div className="mb-6 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
                {error}
              </div>
            )}

            {success && (
              <div className="mb-6 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
                {success}
              </div>
            )}

            <div className="space-y-6">
              <div className="flex items-center gap-2 mb-2">
                <span className="px-3 py-1 text-xs font-medium bg-yellow-200 dark:bg-yellow-800 text-yellow-800 dark:text-yellow-300 rounded-full">
                  Pending
                </span>
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  {t('issue_new.issue_title', 'Title')}
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder={t('issue_new.placeholder_title', 'Enter a title for this issue')}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  {t('issue_new.issue_description', 'Description')}
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder={t('issue_new.placeholder_description', 'Describe this issue...')}
                  rows={10}
                />
              </div>

              <div className="mb-6">
                <label className="block text-sm font-semibold text-card-foreground mb-2">
                  {t('issue_new.labels', 'Labels')}
                </label>
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  className="w-full px-4 py-3 border border-border rounded-xl bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                  placeholder={t('issue_new.labels_placeholder', 'bug, feature, etc.')}
                />
                <p className="mt-1 text-xs text-muted-foreground">{t('issue_new.labels_hint', 'Separate multiple labels with commas')}</p>
              </div>

              {(guestIssue.version || guestIssue.platform) && (
                <div className="bg-muted border border-border rounded-xl p-6 mb-6">
                  <h3 className="text-sm font-semibold text-card-foreground mb-4">{t('guest_issue.metadata', 'Metadata')}</h3>
                  {guestIssue.version && (
                    <div className="mb-2 text-sm text-muted-foreground">
                      <strong>{t('guest_issue.version', 'Version')}:</strong> {guestIssue.version}
                    </div>
                  )}
                  {guestIssue.platform && (
                    <div className="mb-2 text-sm text-muted-foreground">
                      <strong>{t('guest_issue.platform', 'Platform')}:</strong> {guestIssue.platform}
                    </div>
                  )}
                </div>
              )}

              <div className="flex items-center justify-start gap-3">
                {user ? (
                  <>
                    <button
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSaving ? t('guest_issue.saving', 'Saving...') : t('guest_issue.save', 'Save Changes')}
                    </button>

                    <button
                      onClick={handleApprove}
                      disabled={isApproving}
                      className="px-6 py-3 bg-green-600 text-white rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isApproving ? t('guest_issue.approving', 'Approving...') : t('guest_issue.approve', 'Approve & Post to GitLab')}
                    </button>

                    <button
                      onClick={handleReject}
                      disabled={isRejecting}
                      className="px-6 py-3 bg-red-600 text-white rounded-xl hover:opacity-90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isRejecting ? t('guest_issue.rejecting', 'Rejecting...') : t('guest_issue.reject', 'Reject')}
                    </button>
                  </>
                ) : (
                  <div className="text-sm text-muted-foreground">
                    {t('guest_issue.login_required', 'Please log in to edit or approve this issue')}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
