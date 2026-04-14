# Fullstack GitLab Issue Bridge (Scoped + SQLite)

## Goal

Build a fullstack web app that ONLY manages issues created through this app.

Key idea:
- Only display issues created via this system
- Persist mapping in SQLite
- Avoid syncing entire GitLab project

---

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- SQLite (better-sqlite3 or sqlite3)
- Native fetch

---

## Environment Variables

- GITLAB_TOKEN
- GITLAB_PROJECT_ID
- GITLAB_BASE_URL (default: https://gitlab.com/api/v4)

---

## Database (SQLite)

Table: issues

Columns:
- id (primary key)
- gitlab_iid (number)
- title (text)
- created_at (timestamp)

Optional:
- external_id (string)

---

## Core Rule

ONLY show issues that exist in SQLite.

DO NOT fetch all GitLab issues.

---

## Backend (API Routes)

### POST /api/issues

- Create issue in GitLab
- Save to SQLite:
  - gitlab_iid
  - title
- Return created issue

---

### GET /api/issues

- Read from SQLite
- Return stored issues only

---

### GET /api/issues/[iid]

- Fetch details from GitLab API
- Only allow if iid exists in SQLite

---

### GET /api/issues/[iid]/notes

- Fetch comments from GitLab
- Only allow if iid exists in SQLite

---

### POST /api/issues/[iid]/notes

- Add comment via GitLab API
- Only allow if iid exists in SQLite

---

### POST /api/webhook/gitlab

- Log events only (optional future use)

---

## GitLab Client

lib/gitlab.ts

Functions:
- createIssue
- getIssue
- listNotes
- createNote

---

## Frontend Pages

### /issues

- Load from /api/issues (SQLite)
- Display list

---

### /issues/new

- Create issue form
- On submit:
  - POST /api/issues
  - Redirect

---

### /issues/[iid]

- Fetch details (GitLab)
- Fetch comments
- Show comment form

---

## Components

- IssueList
- IssueItem
- IssueDetail
- CommentList
- CommentForm

---

## UI Requirements

- Minimal clean UI
- Fast loading
- No external UI frameworks

---

## Data Flow

Create:
User → API → GitLab → Save in SQLite

Read:
User → API → SQLite (list)
User → API → GitLab (details)

---

## Constraints

- NEVER show issues not created by this app
- Always check SQLite before GitLab calls
- Keep logic simple

---

## Suggested Structure

app/
  api/
    issues/
    webhook/

lib/
  gitlab.ts
  db.ts

---

## Deliverables

- Fullstack app
- SQLite persistence
- Scoped issue system

---

## End Goal

A controlled GitLab issue interface with:
- no full sync
- no duplication complexity
- clean ownership of data
