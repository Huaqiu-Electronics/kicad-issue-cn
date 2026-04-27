'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';
import { Copy } from 'lucide-react';

interface Invite {
  id: string;
  token: string;
  used: boolean;
  createdAt: string;
  email?: string;
  expiresAt?: string;
}

interface User {
  id: string;
  email: string;
  role: string;
  createdAt: string;
}

export default function AdminPage() {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [newInvite, setNewInvite] = useState<Invite | null>(null);
  const [promoteEmail, setPromoteEmail] = useState('');
  const [demoteEmail, setDemoteEmail] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { t } = useI18n();

  useEffect(() => {
    fetchInvites();
    fetchUsers();
  }, []);

  const fetchInvites = async () => {
    try {
      const response = await fetch('/api/admin/invites');
      if (!response.ok) {
        throw new Error('Failed to fetch invites');
      }
      const data = await response.json();
      setInvites(data.invites);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch invites');
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (!response.ok) {
        throw new Error('Failed to fetch user');
      }
      // Note: This would need to be updated to a proper users endpoint
      // For now, we'll just get the current user
      const data = await response.json();
      setUsers([data.user]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch users');
    }
  };

  const handleGenerateInvite = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/invites', {
        method: 'POST',
      });
      if (!response.ok) {
        throw new Error('Failed to generate invite');
      }
      const data = await response.json();
      setNewInvite(data.invite);
      fetchInvites();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate invite');
    } finally {
      setLoading(false);
    }
  };

  const handlePromote = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/promote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: promoteEmail }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to promote user');
      }
      setPromoteEmail('');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to promote user');
    } finally {
      setLoading(false);
    }
  };

  const handleDemote = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/demote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: demoteEmail }),
      });
      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to demote user');
      }
      setDemoteEmail('');
      fetchUsers();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to demote user');
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code);
      // Optionally show a toast or message
      console.log('Code copied to clipboard');
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900">{t('admin.title')}</h1>
        
        {error && (
          <div className="mt-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
            <strong className="font-bold">{t('admin.error')}</strong>
            <span className="block sm:inline"> {error}</span>
          </div>
        )}

        <div className="mt-8 grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Invite Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">{t('admin.invite_management')}</h2>
            <div className="mt-4">
              <button
                onClick={handleGenerateInvite}
                disabled={loading}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? t('admin.generating') : t('admin.generate_invite')}
              </button>
            </div>
            {newInvite && (
              <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
                <strong className="font-bold">{t('admin.new_invite')}</strong>
                <span className="block sm:inline"> {newInvite.token}</span>
              </div>
            )}
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">{t('admin.existing_invites')}</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.code')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.used')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.used_by')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.created_at')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {invites.map((invite) => (
                      <tr key={invite.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 flex items-center">
                          {invite.token}
                          <button
                            onClick={() => handleCopyCode(invite.token)}
                            className="ml-2 p-1 text-gray-400 hover:text-gray-600 focus:outline-none"
                            title="Copy code to clipboard"
                          >
                            <Copy className="h-4 w-4" />
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invite.used ? t('admin.yes') : t('admin.no')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {invite.email || t('admin.na')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(invite.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* User Management */}
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold text-gray-900">{t('admin.user_management')}</h2>
            <div className="mt-4 space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t('admin.promote_user')}</h3>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="email"
                    value={promoteEmail}
                    onChange={(e) => setPromoteEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                  onClick={handlePromote}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('admin.promoting') : t('admin.promote')}
                </button>
                </div>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-700">{t('admin.demote_admin')}</h3>
                <div className="mt-2 flex space-x-2">
                  <input
                    type="email"
                    value={demoteEmail}
                    onChange={(e) => setDemoteEmail(e.target.value)}
                    placeholder="Enter email"
                    className="flex-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md px-3 py-2"
                  />
                  <button
                  onClick={handleDemote}
                  disabled={loading}
                  className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? t('admin.demoting') : t('admin.demote')}
                </button>
                </div>
              </div>
            </div>
            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-700">{t('admin.users')}</h3>
              <div className="mt-2 overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.role')}
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('admin.created_at')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {user.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(user.createdAt).toLocaleString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
