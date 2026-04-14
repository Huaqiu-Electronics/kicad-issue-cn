# GitLab Issue Bridge (Next.js) Task

## High-level goal

Build a lightweight bridge for GitLab that allows:

- Create issues
- Fetch issues
- Reply to issues (comments)
- Receive webhook events (for sync)

---

## Tech stack

- Next.js 14+ (App Router)
- TypeScript
- Native fetch
-  SQLite

---

## Requirements

### 1. Environment Variables

- GITLAB_TOKEN
- GITLAB_PROJECT_ID
- GITLAB_BASE_URL (default: https://gitlab.com/api/v4)

---

### 2. API Routes

#### POST /api/issues

Create a GitLab issue.

Request body:
{
  "title": "string",
  "description": "string",
  "labels": ["string"]
}

---

#### GET /api/issues

Fetch issues list.

Query params:
- state (optional)
- labels (optional)

---

#### GET /api/issues/[iid]

Fetch a single issue.

---

#### GET /api/issues/[iid]/notes

Fetch comments for an issue.

---

#### POST /api/issues/[iid]/notes

Create a comment.

Request body:
{
  "body": "string"
}

---

#### POST /api/webhook/gitlab

Webhook receiver.

Behavior:
- Accept GitLab issue events
- Log event type and issue IID
- Return 200 OK

---

### 3. GitLab Client Helper

Create: lib/gitlab.ts

Functions:
- createIssue()
- listIssues()
- getIssue()
- listNotes()
- createNote()

---

### 4. Basic Validation

- Validate required fields
- Return 400 on invalid input

---

### 5. Logging

- Log all outgoing GitLab API calls
- Log webhook payloads

---

### 6. Optional

- Add in-memory mapping:
  issueIID → externalID

---

## Example curl

Create issue:

curl -X POST http://localhost:3000/api/issues \
  -H "Content-Type: application/json" \
  -d '{"title":"Test","description":"Hello"}'

---

## Suggested structure

app/
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

lib/
  gitlab.ts
  types.ts
