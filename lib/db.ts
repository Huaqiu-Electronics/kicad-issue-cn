import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';
import { open, Database } from 'sqlite';

// Allow database path to be configured via environment variable
const dbPath = process.env.DB_PATH || path.join(process.cwd(), 'data', 'issues.db');

// Ensure the data directory exists
const dataDir = path.dirname(dbPath);
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

let db: Database<sqlite3.Database, sqlite3.Statement> | null = null;

async function initDb() {
  if (db) return;

  db = await open({
    filename: dbPath,
    driver: sqlite3.Database
  });

  // Create issues table if it doesn't exist
  await db.exec(`
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
  await initDb();
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const result = await db.run(`
    INSERT INTO issues (gitlab_iid, title, description, labels, username)
    VALUES (?, ?, ?, ?, ?)
  `, [data.gitlab_iid, data.title, data.description, data.labels, data.username]);
  
  const issue = await getIssueById(result.lastID as number);
  if (!issue) {
    throw new Error('Failed to retrieve inserted issue');
  }
  return issue;
}

export async function getIssueById(id: number): Promise<LocalIssue | undefined> {
  await initDb();
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const issue = await db.get('SELECT * FROM issues WHERE id = ?', [id]);
  return issue as LocalIssue | undefined;
}

export async function getIssueByGitlabIid(gitlab_iid: number): Promise<LocalIssue | undefined> {
  await initDb();
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const issue = await db.get('SELECT * FROM issues WHERE gitlab_iid = ?', [gitlab_iid]);
  return issue as LocalIssue | undefined;
}

export async function getAllIssues(): Promise<LocalIssue[]> {
  await initDb();
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const issues = await db.all('SELECT * FROM issues ORDER BY created_at DESC');
  return issues as LocalIssue[];
}

export async function issueExists(gitlab_iid: number): Promise<boolean> {
  await initDb();
  
  if (!db) {
    throw new Error('Database not initialized');
  }
  
  const result = await db.get('SELECT 1 FROM issues WHERE gitlab_iid = ?', [gitlab_iid]);
  return !!result;
}

export { db };
