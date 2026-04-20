'use client';

import { useState, use } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useI18n } from '@/app/hooks/useI18n';

export default function RegisterPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [inviteCode, setInviteCode] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError(t('register.error_required', '请输入邮箱和密码'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password, inviteCode }),
      });

      if (response.ok) {
        setSuccess(t('register.success', '注册成功！请登录'));
        // Redirect to login page after a short delay
        setTimeout(() => {
          router.push(`/${lang}/login`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('register.error', '注册失败'));
      }
    } catch (error) {
      console.error('Register error:', error);
      setError(t('register.error', '注册失败'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold text-card-foreground">
            {t('register.title', '注册')}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {t('register.subtitle', '创建账号以提交和管理问题')}
          </p>
        </div>

        {error && (
          <div className="p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
            {error}
          </div>
        )}

        {success && (
          <div className="p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm -space-y-px">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
                {t('register.email', '邮箱')}
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={t('register.email_placeholder', '请输入邮箱')}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="password" className="block text-sm font-medium text-card-foreground mb-2">
                {t('register.password', '密码')}
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={t('register.password_placeholder', '请输入密码')}
              />
            </div>
            <div className="mt-4">
              <label htmlFor="inviteCode" className="block text-sm font-medium text-card-foreground mb-2">
                {t('register.invite_code', '邀请码（管理员邮箱无需邀请码）')}
              </label>
              <input
                id="inviteCode"
                name="inviteCode"
                type="text"
                value={inviteCode}
                onChange={(e) => setInviteCode(e.target.value)}
                className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
                placeholder={t('register.invite_code_placeholder', '请输入邀请码')}
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isSubmitting ? t('register.submitting', '注册中...') : t('register.submit', '注册')}
            </button>
          </div>

          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              {t('register.login', '已有账号？')} 
              <Link
                href={`/${lang}/login`}
                className="font-medium text-primary hover:text-primary/80 transition-colors"
              >
                {t('register.login_now', '立即登录')}
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
