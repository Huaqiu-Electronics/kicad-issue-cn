import { GitLabNote } from '@/lib/types';
import CommentItem from './CommentItem';
import { useI18n } from '@/app/hooks/useI18n';

interface CommentListProps {
  notes: GitLabNote[];
}

export default function CommentList({ notes }: CommentListProps) {
  const { t } = useI18n();
  return (
    <div className="space-y-6">
      {notes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-muted-foreground">{t('issue_detail.no_comments', 'No comments')}</p>
        </div>
      ) : (
        notes.map((note) => (
          <CommentItem key={note.id} note={note} />
        ))
      )}
    </div>
  );
}
