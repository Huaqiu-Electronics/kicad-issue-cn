# Fullstack GitLab Issue Bridge (Next.js) Task

## Goal

Build a fullstack web app to interact with GitLab issues:

- Create issues
- View issues list
- View issue details
- Reply to issues (comments)
- Real-time updates via webhook (basic)
- Simple clean UI for China-accessible usage

---

## Tech Stack

- Next.js 14+ (App Router)
- TypeScript
- TailwindCSS
- Native fetch
- Optional: SQLite (later)

---

## Environment Variables

- GITLAB_TOKEN
- GITLAB_PROJECT_ID
- GITLAB_BASE_URL (default: https://gitlab.com/api/v4)

---

## Backend (API Routes)

### POST /api/issues
Create issue

### GET /api/issues
List issues

### GET /api/issues/[iid]
Get issue details

### GET /api/issues/[iid]/notes
Get comments

### POST /api/issues/[iid]/notes
Create comment

### POST /api/webhook/gitlab
Receive webhook events

---

## GitLab Client

lib/gitlab.ts

Functions:
- createIssue
- listIssues
- getIssue
- listNotes
- createNote

---

## Frontend Pages

### 1. /issues (Issue List Page)

Features:
- Fetch issues from /api/issues
- Display list:
  - title
  - state
  - labels
- Click → navigate to /issues/[iid]

---

### 2. /issues/new (Create Issue Page)

Form:
- title (input)
- description (textarea)
- labels (comma separated)

Submit:
- POST /api/issues
- Redirect to /issues

---

### 3. /issues/[iid] (Issue Detail Page)

Features:
- Show:
  - title
  - description
  - labels
  - state
- Fetch comments
- Display comments list

---

### 4. Comment Box

- textarea
- submit → POST /api/issues/[iid]/notes
- refresh comments after submit

---

## Components

- IssueList
- IssueItem
- IssueDetail
- CommentList
- CommentItem
- CommentForm

---

## UI Requirements

- Clean minimal UI
- Responsive
- Use Tailwind
- No heavy UI libraries

---

## Data Fetching

Use:
- React Server Components for initial load
- Client components for actions (create/reply)

---

## Optional Enhancements

- Auto refresh (poll every 10s)
- Toast notifications
- Basic loading states
- Error handling UI

---

## Example Flow

1. User opens /issues
2. Click "New Issue"
3. Submit form
4. Redirect to list
5. Click issue
6. Reply with comment

---

## Suggested Folder Structure

app/
  issues/
    page.tsx
    new/
      page.tsx
    [iid]/
      page.tsx

  api/
    issues/
      route.ts
      [iid]/
        route.ts
        notes/
          route.ts
    webhook/
      gitlab/
        route.ts

components/
  IssueList.tsx
  IssueItem.tsx
  CommentList.tsx
  CommentForm.tsx

lib/
  gitlab.ts
  types.ts

---

## Deliverables

- Working fullstack app
- API connected to GitLab
- UI for creating + replying issues

---

## Testing

Create issue:

curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Hello"}'

---

## End Goal

A simple GitLab issue client usable without accessing GitLab UI directly.
