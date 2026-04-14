import { CreateIssueRequest, CreateNoteRequest, GitLabIssue, GitLabNote } from './types';

const GITLAB_TOKEN = process.env.GITLAB_TOKEN || '';
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID || '';
const GITLAB_BASE_URL = process.env.GITLAB_BASE_URL || 'https://gitlab.com/api/v4';

function getHeaders() {
  return {
    'PRIVATE-TOKEN': GITLAB_TOKEN,
    'Content-Type': 'application/json',
  };
}

export async function createIssue(data: CreateIssueRequest): Promise<GitLabIssue> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    console.warn('[GitLab] Missing credentials, returning mock data');
    return {
      id: Date.now(),
      iid: 1,
      title: data.title,
      description: data.description || '',
      state: 'opened',
      labels: data.labels || [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues`;
  console.log(`[GitLab] Creating issue: ${url}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create issue: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function listIssues(state?: string, labels?: string): Promise<GitLabIssue[]> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    console.warn('[GitLab] Missing credentials, returning mock data');
    return [];
  }
  const url = new URL(`${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues`);
  if (state) url.searchParams.append('state', state);
  if (labels) url.searchParams.append('labels', labels);
  console.log(`[GitLab] Listing issues: ${url.toString()}`);
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to list issues: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getIssue(iid: number): Promise<GitLabIssue> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    console.warn('[GitLab] Missing credentials, returning mock data');
    return {
      id: iid,
      iid: iid,
      title: 'Mock Issue',
      description: 'This is a mock issue description',
      state: 'opened',
      labels: [],
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues/${iid}`;
  console.log(`[GitLab] Getting issue: ${url}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to get issue: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function listNotes(iid: number): Promise<GitLabNote[]> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    console.warn('[GitLab] Missing credentials, returning mock data');
    return [];
  }
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues/${iid}/notes`;
  console.log(`[GitLab] Listing notes: ${url}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  if (!response.ok) {
    throw new Error(`Failed to list notes: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function createNote(iid: number, data: CreateNoteRequest): Promise<GitLabNote> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    console.warn('[GitLab] Missing credentials, returning mock data');
    return {
      id: Date.now(),
      body: data.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
  }
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues/${iid}/notes`;
  console.log(`[GitLab] Creating note: ${url}`);
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(data),
  });
  if (!response.ok) {
    throw new Error(`Failed to create note: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
