'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import IssueList from './IssueList';
import { LocalIssue } from '@/lib/db';

const ITEMS_PER_PAGE = 10;

interface IssueListClientProps {
  initialIssues: LocalIssue[];
  initialGuestIssues: any[];
  t: (key: string, fallback?: string) => string;
  lang: string;
  user: any;
}

export default function IssueListClient({ initialIssues, initialGuestIssues, t, lang, user }: IssueListClientProps) {
  const [issues] = useState<LocalIssue[]>(initialIssues);
  const [guestIssues] = useState<any[]>(initialGuestIssues);
  const [searchTitle, setSearchTitle] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  // Combine both issues and guest issues
  const allIssues = [
    ...guestIssues.map(gi => ({ ...gi, isGuestIssue: true })),
    ...issues.map(i => ({ ...i, isGuestIssue: false })),
  ];

  // Compute filtered issues directly during rendering
  const filteredIssues = allIssues.filter(issue => {
    let match = true;
    if (searchTitle.trim()) {
      match = match && issue.title.toLowerCase().includes(searchTitle.toLowerCase());
    }
    return match;
  });

  const totalPages = Math.ceil(filteredIssues.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentIssues = filteredIssues.slice(startIndex, endIndex);

  const goToPrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const goToNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-10">
        <div className="flex-1 w-full">
          <div>
            <label className="block text-sm font-medium text-muted-foreground mb-2">{t('issues.search_title')}</label>
            <input
              type="text"
              value={searchTitle}
              onChange={(e) => setSearchTitle(e.target.value)}
              placeholder={t('issues.search_placeholder')}
              className="w-full px-4 py-3 rounded-xl border border-border bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            />
          </div>
        </div>
        <Link
          href={`/${lang}/issues/new`}
          className="px-6 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg whitespace-nowrap"
        >
          {t('issues.new_issue')}
        </Link>
      </div>
      
      <IssueList issues={currentIssues} t={t} lang={lang} user={user} />
      
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 mt-10">
          <button
            onClick={goToPrevPage}
            disabled={currentPage === 1}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-4 h-4" />
            {t('issues.prev_page')}
          </button>
          <div className="text-center">
            <span className="text-muted-foreground">
              {t('issues.page')} {currentPage} {t('issues.of')} {totalPages} {t('issues.pages')}
            </span>
            <span className="text-muted-foreground ml-2">
              ({filteredIssues.length} {t('issues.records')})
            </span>
          </div>
          <button
            onClick={goToNextPage}
            disabled={currentPage === totalPages}
            className="flex items-center gap-2 px-4 py-2 bg-card border border-border rounded-lg text-card-foreground hover:bg-accent hover:text-accent-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {t('issues.next_page')}
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </>
  );
}
