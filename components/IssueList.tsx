import { GitLabIssue } from '@/lib/types';
import IssueItem from './IssueItem';

interface IssueListProps {
  issues: GitLabIssue[];
}

export default function IssueList({ issues }: IssueListProps) {
  return (
    <div className="space-y-4">
      {issues.length === 0 ? (
        <p className="text-gray-500 text-center py-8">No issues found</p>
      ) : (
        issues.map((issue) => (
          <IssueItem key={issue.id} issue={issue} />
        ))
      )}
    </div>
  );
}
