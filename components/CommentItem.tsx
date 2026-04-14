import { GitLabNote } from '@/lib/types';

interface CommentItemProps {
  note: GitLabNote;
}

export default function CommentItem({ note }: CommentItemProps) {
  return (
    <div className="p-4 border rounded-lg bg-gray-50">
      <div className="text-sm text-gray-500 mb-2">
        {new Date(note.created_at).toLocaleString()}
      </div>
      <p className="text-gray-700 whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
