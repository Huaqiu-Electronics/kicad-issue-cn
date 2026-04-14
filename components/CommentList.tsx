import { GitLabNote } from '@/lib/types';
import CommentItem from './CommentItem';

interface CommentListProps {
  notes: GitLabNote[];
}

export default function CommentList({ notes }: CommentListProps) {
  return (
    <div className="space-y-4">
      {notes.length === 0 ? (
        <p className="text-gray-500 text-center py-4">No comments yet</p>
      ) : (
        notes.map((note) => (
          <CommentItem key={note.id} note={note} />
        ))
      )}
    </div>
  );
}
