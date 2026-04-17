'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

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
                {error && (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded" role="alert">
                    <strong className="font-bold">错误:</strong>
                    <span className="block sm:inline"> {error}</span>
                  </div>
                )}
                <div>
                  <label htmlFor="title" className="block text-sm font-semibold text-card-foreground mb-2">
                    标题
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
                      className="w-full px-4 py-3 bg-card text-card-foreground focus:ring-0 border-0 font-mono text-sm placeholder-muted-foreground"
                      placeholder="请描述这个问题..."
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
                <h3 className="text-sm font-semibold text-card-foreground">操作</h3>
              </div>
              <div className="p-4 space-y-4">
                <button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting || !title.trim()}
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
                  className="w-full px-3 py-2 border border-border rounded-xl bg-card text-card-foreground text-sm placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
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
