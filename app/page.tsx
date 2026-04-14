import Link from "next/link";
import IssueList from "@/components/IssueList";
import { getAllIssues } from "@/lib/db";

export const dynamic = "force-dynamic";

export default async function Home() {
  const issues = await getAllIssues();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-12">
        <h1 className="text-5xl font-bold text-card-foreground mb-4">
          KiCad 官方 Issue 提交桥
        </h1>

        <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
          为中国用户提供的 KiCad 官方 Issue 提交入口。 所有问题将同步提交到
          GitLab 官方仓库，支持创建、查看与跟进。
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          <Link
            href="/issues/new"
            className="px-8 py-3 bg-primary text-primary-foreground rounded-xl hover:opacity-90 transition-all transform hover:scale-105 shadow-lg"
          >
            新建问题
          </Link>
          <Link
            href="/issues"
            className="px-8 py-3 border-2 border-border text-card-foreground rounded-xl hover:bg-muted transition-all transform hover:scale-105"
          >
            查看全部
          </Link>
        </div>
      </div>
      <div className="max-w-4xl mx-auto">
        <IssueList issues={issues} />
      </div>
    </div>
  );
}
