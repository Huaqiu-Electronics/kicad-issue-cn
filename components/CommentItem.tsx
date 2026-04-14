import { GitLabNote } from '@/lib/types';

interface CommentItemProps {
  note: GitLabNote;
}

export default function CommentItem({ note }: CommentItemProps) {
  return (
    <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-xl bg-gray-50 dark:bg-gray-800">
      <div className="text-sm text-gray-500 dark:text-gray-400 mb-3">
        {new Date(note.created_at).toLocaleString()}
      </div>
      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{note.body}</p>
    </div>
  );
}
