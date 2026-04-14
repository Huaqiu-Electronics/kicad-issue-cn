import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

// Allow database path to be configured via environment variable
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'issues.db');

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma('journal_mode = WAL');

// Create issues table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS issues (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    gitlab_iid INTEGER NOT NULL UNIQUE,
    title TEXT NOT NULL,
    description TEXT,
    labels TEXT,
    username TEXT NOT NULL,
    created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  )
`);

export interface LocalIssue {
  id: number;
  gitlab_iid: number;
  title: string;
  description?: string;
  labels?: string;
  username: string;
  created_at: string;
}

export function insertIssue(data: {
  gitlab_iid: number;
  title: string;
  description?: string;
  labels?: string;
  username: string;
}): LocalIssue {
  const stmt = db.prepare(`
    INSERT INTO issues (gitlab_iid, title, description, labels, username)
    VALUES (?, ?, ?, ?, ?)
  `);
  const result = stmt.run(data.gitlab_iid, data.title, data.description, data.labels, data.username);
  const issue = getIssueById(result.lastInsertRowid as number);
  if (!issue) {
    throw new Error('Failed to retrieve inserted issue');
  }
  return issue;
}

export function getIssueById(id: number): LocalIssue | undefined {
  const stmt = db.prepare('SELECT * FROM issues WHERE id = ?');
  const row = stmt.get(id);
  return row as LocalIssue | undefined;
}

export function getIssueByGitlabIid(gitlab_iid: number): LocalIssue | undefined {
  const stmt = db.prepare('SELECT * FROM issues WHERE gitlab_iid = ?');
  const row = stmt.get(gitlab_iid);
  return row as LocalIssue | undefined;
}

export function getAllIssues(): LocalIssue[] {
  const stmt = db.prepare('SELECT * FROM issues ORDER BY created_at DESC');
  const rows = stmt.all();
  return rows as LocalIssue[];
}

export function issueExists(gitlab_iid: number): boolean {
  const stmt = db.prepare('SELECT 1 FROM issues WHERE gitlab_iid = ?');
  const row = stmt.get(gitlab_iid);
  return !!row;
}

export { db };
