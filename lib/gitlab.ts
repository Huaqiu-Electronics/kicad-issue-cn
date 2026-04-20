import { CreateIssueRequest, CreateNoteRequest, GitLabIssue, GitLabNote } from './types';

const KICAD_GITLAB_PROJECT_ID = '15502567'
const GITLAB_TOKEN = process.env.GITLAB_TOKEN || '';
const GITLAB_PROJECT_ID = process.env.GITLAB_PROJECT_ID || KICAD_GITLAB_PROJECT_ID;
const GITLAB_BASE_URL = process.env.GITLAB_BASE_URL || 'https://gitlab.com/api/v4';

function getHeaders() {
  return {
    'PRIVATE-TOKEN': GITLAB_TOKEN,
    'Content-Type': 'application/json',
  };
}

export async function createIssue(data: CreateIssueRequest): Promise<GitLabIssue> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    throw new Error('Authentication required to create issues');
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
  const url = new URL(`${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues`);
  if (state) url.searchParams.append('state', state);
  if (labels) url.searchParams.append('labels', labels);
  console.log(`[GitLab] Listing issues: ${url.toString()}`);
  
  // Use headers with token if available, otherwise make unauthenticated request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (GITLAB_TOKEN) {
    headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
  }
  
  const response = await fetch(url.toString(), {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to list issues: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function getIssue(iid: number): Promise<GitLabIssue> {
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues/${iid}`;
  console.log(`[GitLab] Getting issue: ${url}`);
  
  // Use headers with token if available, otherwise make unauthenticated request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (GITLAB_TOKEN) {
    headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to get issue: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function listNotes(iid: number): Promise<GitLabNote[]> {
  const url = `${GITLAB_BASE_URL}/projects/${GITLAB_PROJECT_ID}/issues/${iid}/notes`;
  console.log(`[GitLab] Listing notes: ${url}`);
  
  // Use headers with token if available, otherwise make unauthenticated request
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (GITLAB_TOKEN) {
    headers['PRIVATE-TOKEN'] = GITLAB_TOKEN;
  }
  
  const response = await fetch(url, {
    method: 'GET',
    headers,
  });
  if (!response.ok) {
    throw new Error(`Failed to list notes: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

export async function createNote(iid: number, data: CreateNoteRequest): Promise<GitLabNote> {
  if (!GITLAB_TOKEN || !GITLAB_PROJECT_ID) {
    throw new Error('Authentication required to create notes');
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
