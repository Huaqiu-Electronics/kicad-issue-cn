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
  id: number;
  gitlab_iid: number;
  title: string;
  description?: string;
  labels?: string;
  username: string;
  created_at: string;
}

export async function insertIssue(data: {
  gitlab_iid: number;
  title: string;
  description?: string;
  labels?: string;
  username: string;
}): Promise<LocalIssue> {
  const issue = await prisma.issue.create({
    data: {
      gitlabIid: data.gitlab_iid,
      title: data.title,
      description: data.description,
      labels: data.labels,
      username: data.username,
    },
  });

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    description: issue.description,
    labels: issue.labels,
    username: issue.username,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getIssueById(id: number): Promise<LocalIssue | undefined> {
  const issue = await prisma.issue.findUnique({
    where: { id },
  });

  if (!issue) return undefined;

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    description: issue.description,
    labels: issue.labels,
    username: issue.username,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getIssueByGitlabIid(gitlab_iid: number): Promise<LocalIssue | undefined> {
  const issue = await prisma.issue.findUnique({
    where: { gitlabIid: gitlab_iid },
  });

  if (!issue) return undefined;

  return {
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    description: issue.description,
    labels: issue.labels,
    username: issue.username,
    created_at: issue.createdAt.toISOString(),
  };
}

export async function getAllIssues(): Promise<LocalIssue[]> {
  const issues = await prisma.issue.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return issues.map(issue => ({
    id: issue.id,
    gitlab_iid: issue.gitlabIid,
    title: issue.title,
    description: issue.description,
    labels: issue.labels,
    username: issue.username,
    created_at: issue.createdAt.toISOString(),
  }));
}

export async function issueExists(gitlab_iid: number): Promise<boolean> {
  const count = await prisma.issue.count({
    where: { gitlabIid: gitlab_iid },
  });
  return count > 0;
}

export { prisma as db };
