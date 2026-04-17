import { getCurrentUser } from '@/lib/auth';
import HomeContent from './home-content';

export const dynamic = 'force-dynamic';

export default async function HomePage({ params }: { params: Promise<{ lang: string }> }) {
  const user = await getCurrentUser();
  const { lang } = await params;
  
  return (
    <HomeContent user={user} lang={lang} />
  );
}
