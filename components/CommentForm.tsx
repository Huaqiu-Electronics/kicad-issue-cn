'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface CommentFormProps {
  iid: number;
}

export default function CommentForm({ iid }: CommentFormProps) {
  const [body, setBody] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!body.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch(`/api/issues/${iid}/notes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body }),
      });

      if (response.ok) {
        setBody('');
        router.refresh();
      } else {
        console.error('添加评论失败');
      }
    } catch (error) {
      console.error('错误:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-card rounded-xl border border-border p-6">
      <div>
        <label htmlFor="body" className="block text-sm font-medium text-card-foreground mb-2">
          添加评论
        </label>
        <textarea
          id="body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={4}
          className="w-full px-4 py-3 border border-border rounded-xl bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          placeholder="写下您的评论..."
        />
      </div>
      <button
        type="submit"
        disabled={isSubmitting || !body.trim()}
        className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 shadow-lg"
      >
        {isSubmitting ? '提交中...' : '添加评论'}
      </button>
    </form>
  );
}
