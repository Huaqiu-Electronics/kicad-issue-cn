'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

interface Invite {
  id: string;
  code: string;
  used: boolean;
  usedBy: string | null;
  createdAt: string;
}

export default function AdminPage({ params }: { params: Promise<{ lang: string }> }) {
  const { lang } = use(params);
  const [users, setUsers] = useState<User[]>([]);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [newEmail, setNewEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    fetchUsers();
    fetchInvites();
  }, []);

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
        setSuccess(t('admin.invite_success', '邀请已创建'));
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
                      <button
                        onClick={() => handleDemote(user)}
                        className="text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                      >
                        {t('admin.demote', '降级')}
                      </button>
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
                  {t('admin.used_by', '使用者')}
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
                    {invite.usedBy || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-card-foreground">
                    {invite.code}
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
    </div>
  );
}
