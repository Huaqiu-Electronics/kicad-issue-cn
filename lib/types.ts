export interface CreateIssueRequest {
  title: string;
  description?: string;
  labels?: string[];
}

export interface CreateNoteRequest {
  body: string;
}

export interface GitLabUser {
  id: number;
  name: string;
  username: string;
  avatar_url?: string;
}

export interface GitLabIssue {
  id: number;
  iid: number;
  title: string;
  description: string;
  state: string;
  labels: string[];
  created_at: string;
  updated_at: string;
  author?: GitLabUser;
}

export interface GitLabNote {
  id: number;
  body: string;
  created_at: string;
  updated_at: string;
  author?: GitLabUser;
}
