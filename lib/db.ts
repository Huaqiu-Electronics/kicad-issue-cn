import { PrismaClient } from '@prisma/client';

let prisma: PrismaClient;

if (process.env.NODE_ENV === 'production') {
  prisma = new PrismaClient();
} else {
  // In development, use a global variable to prevent multiple PrismaClient instances
  if (!global.prisma) {
    global.prisma = new PrismaClient();
  }
  prisma = global.prisma;
}

export interface LocalIssue {
  id: string;
  gitlab_iid: number;
  title: string;
  user_id: string;
  user_nickname: string;
  created_at: string;
}

export async function insertIssue(data: {
  gitlab_iid: number;
  title: string;
  user_id: string;
}): Promise<LocalIssue> {
  const issue = await prisma.issue.create({
    data: {
      gitlabIid: data.gitlab_iid,
      title: data.title,
      userId: data.user_id,
    },
    include: { user: true },
  });

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    user_id: issue.userId,
    user_nickname: issue.user.nickname,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getIssueById(id: string): Promise<LocalIssue | undefined> {
  const issue = await prisma.issue.findUnique({
    where: { id },
    include: { user: true },
  });

  if (!issue) return undefined;

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    user_id: issue.userId,
    user_nickname: issue.user.nickname,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getIssueByGitlabIid(gitlab_iid: number): Promise<LocalIssue | undefined> {
  const issue = await prisma.issue.findUnique({
    where: { gitlabIid: gitlab_iid },
    include: { user: true },
  });

  if (!issue) return undefined;

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    user_id: issue.userId,
    user_nickname: issue.user.nickname,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getIssuesByUserId(user_id: string): Promise<LocalIssue[]> {
  const issues = await prisma.issue.findMany({
    where: { userId: user_id },
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return issues.map(issue => ({
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    user_id: issue.userId,
    user_nickname: issue.user.nickname,
    created_at: issue.createdAt.toISOString(),
  }));
}

export async function getAllIssues(): Promise<LocalIssue[]> {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
    include: { user: true },
  });

  return issues.map(issue => ({
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    user_id: issue.userId,
    user_nickname: issue.user.nickname,
    created_at: issue.createdAt.toISOString(),
  }));
}

export async function issueExists(gitlab_iid: number): Promise<boolean> {
  const count = await prisma.issue.count({
    where: { gitlabIid: gitlab_iid },
  });
  return count > 0;
}

export { prisma };
