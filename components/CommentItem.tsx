import { GitLabNote } from '@/lib/types';

interface CommentItemProps {
  note: GitLabNote;
}

export default function CommentItem({ note }: CommentItemProps) {
  return (
    <div className="p-6 border border-border rounded-xl bg-muted">
      <div className="text-sm text-muted-foreground mb-3">
        {new Date(note.created_at).toLocaleString()}
      </div>
      <p className="text-card-foreground whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
