'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const KICAD_ISSUE_TEMPLATE = `<!-- --------Before Creating a New Issue----------- 
 * Limit report to a single issue. 
 * Search the issue tracker to verify the issue has not already been reported. 
 * Complete all instructions between \`template comment markers <>. 
 * Keep report contents limited to the necessary information required to fix the issue. 
 * When creating an issue against the stable version of KiCad, make sure the latest available stable version is installed as issues may have already been resolved in later stable versions. --> 

# Description 
<!-- What is the current behavior and what is the expected behavior?  --> 
<!-- If the issue is visual/graphical, please attach screenshots of the problem. --> 
<!--  Add the issue details below this line and before the "Steps to reproduce" heading. --> 


# Steps to reproduce 
<!-- If there are multiple steps to reproduce it or it is a visual issue, then providing a screen recording as an attachment to this report is recommended. --> 
<!-- If this issue is specific to a project, please attach the necessary files to this issue. --> 
<!--  Add the steps to reproduce using the numbers below --> 
<!--  Add new step numbers before the "KiCad Version" heading. --> 
1. 
2. 

# KiCad Version 
<!-- Copy version information (from main menu Help->About KiCad ->Copy Version Info) and paste it between the triple backticks below to preserve the formatting. --> 
\`\`\` 
\`\`\``;

export default function NewIssuePage() {
  const [username, setUsername] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState(KICAD_ISSUE_TEMPLATE);
  const [labels, setLabels] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const savedUsername = localStorage.getItem('gitlab-issue-username');
    if (savedUsername) {
      setUsername(savedUsername);
    }
  }, []);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newUsername = e.target.value;
    setUsername(newUsername);
    localStorage.setItem('gitlab-issue-username', newUsername);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !username.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/issues', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username,
          title,
          description: description || undefined,
          labels: labels ? labels.split(',').map(l => l.trim()) : undefined,
        }),
      });

      if (response.ok) {
        router.push('/issues');
      } else {
        console.error('创建问题失败');
      }
    } catch (error) {
      console.error('错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/issues" className="inline-flex items-center text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回问题列表
        </Link>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Main content */}
        <div className="lg:col-span-3">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            {/* Header */}
            <div className="border-b border-gray-200 dark:border-gray-700 px-6 py-4">
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">新建问题</h1>
            </div>
            
            {/* Form */}
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label htmlFor="title" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  标题
                </label>
                <input
                  type="text"
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                  placeholder="请输入问题标题"
                  required
                />
              </div>
              
              <div>
                <label htmlFor="description" className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  描述
                </label>
                <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                  {/* Toolbar placeholder */}
                  <div className="bg-gray-50 dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 px-3 py-2 flex items-center gap-2">
                    <span className="text-xs text-gray-500 dark:text-gray-400">Markdown 已支持</span>
                  </div>
                  <textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={20}
                    className="w-full px-4 py-3 bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-0 border-0 font-mono text-sm"
                    placeholder="请描述这个问题..."
                  />
                </div>
              </div>
            </form>
          </div>
        </div>
        
        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">操作</h3>
            </div>
            <div className="p-4 space-y-4">
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isSubmitting || !title.trim() || !username.trim()}
                className="w-full px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isSubmitting ? '创建中...' : '创建问题'}
              </button>
              <Link
                href="/issues"
                className="w-full block text-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 font-medium rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                取消
              </Link>
            </div>
          </div>
          
          {/* User info */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">提交者信息</h3>
            </div>
            <div className="p-4">
              <div>
                <label htmlFor="username" className="block text-xs font-medium text-gray-700 dark:text-gray-400 mb-1">
                  您的姓名
                </label>
                <input
                  type="text"
                  id="username"
                  value={username}
                  onChange={handleUsernameChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="请输入您的姓名"
                  required
                />
              </div>
            </div>
          </div>
          
          {/* Labels */}
          <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 dark:border-gray-700 px-4 py-3">
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">标签</h3>
            </div>
            <div className="p-4">
              <input
                type="text"
                value={labels}
                onChange={(e) => setLabels(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="bug, 新功能, 等"
              />
              <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">用逗号分隔多个标签</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
