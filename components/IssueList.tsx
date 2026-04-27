import IssueItem from './IssueItem';

interface IssueListProps {
  issues: any[];
  t?: (key: string, fallback?: string) => string;
  lang?: string;
  user?: any;
}

export default function IssueList({ issues, t, lang = 'zh', user }: IssueListProps) {
  const translate = t || (key => key);
  return (
    <div className="space-y-6">
      {issues.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-muted-foreground">{translate('issues.no_issues')}</p>
        </div>
      ) : (
        issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} lang={lang} user={user} />
        ))
      )}
    </div>
  );
}
