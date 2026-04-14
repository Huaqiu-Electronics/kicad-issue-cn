import { GitLabNote } from '@/lib/types';
import CommentItem from './CommentItem';

interface CommentListProps {
  notes: GitLabNote[];
}

export default function CommentList({ notes }: CommentListProps) {
  return (
    <div className="space-y-6">
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-500 dark:text-gray-400">暂无评论</p>
        </div>
      ) : (
        notes.map((note) => (
          <CommentItem key={note.id} note={note} />
        ))
      )}
    </div>
  );
}
