'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const KICAD_ISSUE_TEMPLATE = `# Description


# Steps to reproduce
1. 
2. 

# KiCad Version
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <Link href="/issues" className="inline-flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回问题列表
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
                <h3 className="text-sm font-bold">提示</h3>
              </div>
            </div>
            <div className="p-4 space-y-3 text-sm">
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>只报告一个问题</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>先搜索确认该问题未被报告</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>只提供修复问题所需的必要信息</p>
              </div>
              <div className="flex gap-2">
                <svg className="w-4 h-4 text-primary shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p>使用稳定版请确保是最新版本</p>
              </div>
              <div className="mt-3 pt-3 border-t border-border">
                <p className="text-xs text-muted-foreground font-medium">
                  📸 视觉问题请附截图，步骤复杂请附视频
                </p>
                <p className="text-xs text-muted-foreground font-medium mt-1">
                  🔢 在 <strong>KiCad Version</strong> 部分粘贴版本信息（帮助 → 关于 KiCad → 复制版本信息）
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
                <h1 className="text-2xl font-bold text-card-foreground">新建问题</h1>
              </div>
              
              {/* Form */}
              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-card-foreground mb-2">
                    标题
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="w-full px-4 py-3 border border-border rounded-lg bg-background text-foreground focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors text-lg"
                    placeholder="请输入问题标题"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="description" className="block text-sm font-semibold text-card-foreground mb-2">
                    描述
                  </label>
                  <div className="border border-border rounded-lg overflow-hidden">
                    {/* Toolbar placeholder */}
                    <div className="bg-muted border-b border-border px-3 py-2 flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Markdown 已支持</span>
                    </div>
                    <textarea
                      id="description"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      rows={20}
                      className="w-full px-4 py-3 bg-background text-foreground focus:ring-0 border-0 font-mono text-sm"
                      placeholder="请描述这个问题..."
                    />
                  </div>
                </div>
              </form>
            </div>
          </div>
          
          {/* Sidebar cards: 操作, 提交者信息, 标签 */}
          <div className="space-y-6">
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">操作</h3>
              </div>
              <div className="p-4 space-y-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim() || !username.trim()}
                  className="w-full px-4 py-2 bg-primary text-primary-foreground font-medium rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isSubmitting ? '创建中...' : '创建问题'}
                </button>
                <Link
                  href="/issues"
                  className="w-full block text-center px-4 py-2 border border-border text-card-foreground font-medium rounded-lg hover:bg-muted transition-colors"
                >
                  取消
                </Link>
              </div>
            </div>
            
            {/* User info */}
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">提交者信息</h3>
              </div>
              <div className="p-4">
                <div>
                  <label htmlFor="username" className="block text-xs font-medium text-muted-foreground mb-1">
                    您的姓名
                  </label>
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={handleUsernameChange}
                    className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                    placeholder="请输入您的姓名"
                    required
                  />
                </div>
              </div>
            </div>
            
            {/* Labels */}
            <div className="bg-card border border-border rounded-lg shadow-sm">
              <div className="border-b border-border px-4 py-3">
                <h3 className="text-sm font-semibold text-card-foreground">标签</h3>
              </div>
              <div className="p-4">
                <input
                  type="text"
                  value={labels}
                  onChange={(e) => setLabels(e.target.value)}
                  className="w-full px-3 py-2 border border-border rounded-lg bg-background text-foreground text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                  placeholder="bug, 新功能, 等"
                />
                <p className="mt-1 text-xs text-muted-foreground">用逗号分隔多个标签</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
