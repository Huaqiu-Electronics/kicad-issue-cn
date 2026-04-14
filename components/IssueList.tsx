import { LocalIssue } from '@/lib/db';
import IssueItem from './IssueItem';

interface IssueListProps {
  issues: LocalIssue[];
}

export default function IssueList({ issues }: IssueListProps) {
  return (
    <div className="space-y-6">
      {issues.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-2xl text-muted-foreground">暂无问题</p>
        </div>
      ) : (
        issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))
      )}
    </div>
  );
}
