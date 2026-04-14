import { GitLabNote } from '@/lib/types';

interface CommentItemProps {
  note: GitLabNote;
}

export default function CommentItem({ note }: CommentItemProps) {
  return (
    <div className="p-6 border border-border rounded-xl bg-muted">
      <div className="flex items-center gap-3 mb-3">
        {note.author && (
          <span className="font-semibold text-card-foreground">
            {note.author.name}
            <span className="text-muted-foreground font-normal ml-1">@{note.author.username}</span>
          </span>
        )}
        <span className="text-sm text-muted-foreground">
          {new Date(note.created_at).toLocaleString()}
        </span>
      </div>
      <p className="text-card-foreground whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
