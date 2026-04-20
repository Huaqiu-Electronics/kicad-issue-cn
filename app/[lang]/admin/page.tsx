'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';
import { Copy } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Invite {
  id: string;
  email: string;
  token: string;
  used: boolean;
  usedBy: string | null;
  createdAt: string;
  expiresAt: string;
}

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [currentUserEmail, setCurrentUserEmail] = useState('');
  const [showInviteDialog, setShowInviteDialog] = useState(false);
  const [generatedInvite, setGeneratedInvite] = useState<Invite | null>(null);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    fetchUsers();
    fetchInvites();
    fetchCurrentUser();
  }, []);

  const fetchCurrentUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const user = await response.json();
        setCurrentUserEmail(user.email);
      }
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('admin.error', '获取用户列表失败'));
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(t('admin.error', '获取用户列表失败'));
    }
  };

  const fetchInvites = async () => {
    try {
      const response = await fetch('/api/admin/invites');
      if (response.ok) {
        const data = await response.json();
        setInvites(data.invites);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('admin.error', '获取邀请列表失败'));
      }
    } catch (error) {
      console.error('Error fetching invites:', error);
      setError(t('admin.error', '获取邀请列表失败'));
    }
  };

  const handlePromote = async (user: User) => {
    try {
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      if (response.ok) {
        setSuccess(t('admin.promote_success', '用户已提升为管理员'));
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('admin.error', '提升用户失败'));
      }
    } catch (error) {
      console.error('Error promoting user:', error);
      setError(t('admin.error', '提升用户失败'));
    }
  };

  const handleDemote = async (user: User) => {
    try {
      const response = await fetch('/api/admin/demote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: user.email }),
      });
      if (response.ok) {
        setSuccess(t('admin.demote_success', '用户已降级为普通用户'));
        fetchUsers();
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('admin.error', '降级用户失败'));
      }
    } catch (error) {
      console.error('Error demoting user:', error);
      setError(t('admin.error', '降级用户失败'));
    }
  };

  const handleCreateInvite = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmail) {
      setError(t('admin.error_required', '请输入邮箱'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: newEmail }),
      });

      if (response.ok) {
        const data = await response.json();
        setGeneratedInvite(data.invite);
        setShowInviteDialog(true);
        setNewEmail('');
        fetchInvites();
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('admin.error', '创建邀请失败'));
      }
    } catch (error) {
      console.error('Error creating invite:', error);
      setError(t('admin.error', '创建邀请失败'));
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopyInvite = async () => {
    if (generatedInvite) {
      try {
        await navigator.clipboard.writeText(generatedInvite.token);
        setSuccess(t('admin.invite_copied', '邀请码已复制到剪贴板'));
      } catch (error) {
        console.error('Error copying invite:', error);
      }
    }
  };

  const handleCopyToken = async (token: string) => {
    try {
      await navigator.clipboard.writeText(token);
      setSuccess(t('admin.invite_copied', '邀请码已复制到剪贴板'));
    } catch (error) {
      console.error('Error copying token:', error);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6 text-card-foreground">{t('admin.title', '管理员面板')}</h1>

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

      {/* Invite Form */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">{t('admin.create_invite', '创建邀请')}</h2>
        <form onSubmit={handleCreateInvite} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-card-foreground mb-2">
              {t('admin.email', '邮箱')}
            </label>
            <input
              type="email"
              id="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
              placeholder={t('admin.email_placeholder', '请输入邮箱')}
            />
          </div>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t('admin.submitting', '提交中...') : t('admin.submit', '提交')}
          </button>
        </form>
      </div>

      {/* Users List */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">{t('admin.users', '用户列表')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.email', '邮箱')}
                </th>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.role', '角色')}
                </th>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.created_at', '创建时间')}
                </th>
                <th className="px-6 py-3 bg-muted text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.actions', '操作')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {users.map((user) => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      user.role === 'admin' 
                        ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' 
                        : 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300'
                    }`}>
                      {user.role === 'admin' ? t('admin.admin', '管理员') : t('admin.user', '用户')}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(user.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    {user.role === 'admin' ? (
                      user.email === currentUserEmail ? (
                        <span className="text-muted-foreground">-</span>
                      ) : (
                        <button
                          onClick={() => handleDemote(user)}
                          className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                        >
                          {t('admin.demote', '降级')}
                        </button>
                      )
                    ) : (
                      <button
                        onClick={() => handlePromote(user)}
                        className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300 transition-colors"
                      >
                        {t('admin.promote', '提升')}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invites List */}
      <div className="bg-card border border-border rounded-lg shadow-sm p-6">
        <h2 className="text-xl font-semibold mb-4 text-card-foreground">{t('admin.invites', '邀请列表')}</h2>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.email', '邮箱')}
                </th>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.token', '邀请码')}
                </th>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.created_at', '创建时间')}
                </th>
                <th className="px-6 py-3 bg-muted text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {t('admin.status', '状态')}
                </th>
              </tr>
            </thead>
            <tbody className="bg-card divide-y divide-border">
              {invites.map((invite) => (
                <tr key={invite.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {invite.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground flex items-center">
                    {invite.token}
                    <button
                      onClick={() => handleCopyToken(invite.token)}
                      className="ml-2 p-1 text-muted-foreground hover:text-card-foreground focus:outline-none"
                      title="复制邀请码到剪贴板"
                    >
                      <Copy className="h-4 w-4" />
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                    {new Date(invite.createdAt).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      invite.used 
                        ? 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300' 
                        : 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                    }`}>
                      {invite.used ? t('admin.used', '已使用') : t('admin.unused', '未使用')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invite Dialog */}
      {showInviteDialog && generatedInvite && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h2 className="text-xl font-bold mb-6 text-card-foreground">{t('admin.invite_created', '邀请已创建')}</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t('admin.email', '邮箱')}</label>
                <p className="text-card-foreground">{generatedInvite.email}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-muted-foreground mb-2">{t('admin.token', '邀请码')}</label>
                <div className="flex items-center space-x-2">
                  <code className="flex-1 bg-muted p-3 rounded-lg text-sm font-mono text-card-foreground">
                    {generatedInvite.token}
                  </code>
                  <button
                    onClick={handleCopyInvite}
                    className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 transition-colors"
                  >
                    {t('admin.copy', '复制')}
                  </button>
                </div>
              </div>
            </div>
            <div className="mt-8 flex justify-end">
              <button
                onClick={() => setShowInviteDialog(false)}
                className="px-6 py-2 bg-border text-card-foreground rounded-lg hover:bg-border/80 transition-colors"
              >
                {t('admin.close', '关闭')}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
