import Link from "next/link";
import IssueList from "@/components/IssueList";
import { getAllIssues } from "@/lib/db";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const issues = await getAllIssues();

  return (
    <div className="flex flex-col flex-1 items-center bg-zinc-50 font-sans dark:bg-black min-h-screen">
      <main className="flex w-full max-w-4xl flex-col py-8 px-4 bg-white dark:bg-black">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50 mb-2">
            GitLab 问题桥接器
          </h1>
          <p className="text-lg leading-8 text-zinc-600 dark:text-zinc-400 mb-4">
            一个轻量级的 Web 应用，无需直接访问 GitLab UI 即可与 GitLab 问题进行交互。
          </p>
          <div className="flex gap-4">
            <Link
              href="/issues/new"
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              新建问题
            </Link>
            <Link
              href="/issues"
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              查看全部
            </Link>
          </div>
        </div>
        <IssueList issues={issues} />
      </main>
    </div>
  );
}
