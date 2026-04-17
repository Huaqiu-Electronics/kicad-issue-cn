# kicad-issue-cn Fullstack Task (PostgreSQL + Auth + Admin + Invite)

## Goal

Build a controlled GitLab issue bridge for KiCad:

- Serve Chinese users to submit issues to GitLab
- Only show issues created via this app
- Add authentication system
- Add invite-only access
- Add admin management system
- Use PostgreSQL (no SQLite)

---

## Tech Stack

- Next.js (App Router)
- TypeScript
- TailwindCSS
- PostgreSQL
- Prisma ORM (recommended)
- Native fetch

---

## Environment Variables

- GITLAB_TOKEN
- GITLAB_PROJECT_ID
- GITLAB_BASE_URL=https://gitlab.com/api/v4
- DATABASE_URL=postgresql://user:pass@host:5432/db
- ADMIN_EMAILS=admin@example.com

---

## Database Schema (PostgreSQL)

### User
- id (uuid, PK)
- email (unique)
- passwordHash
- role (default: 'user')
- createdAt

---

### Invite
- id (uuid, PK)
- code (unique)
- used (boolean)
- usedBy (User FK nullable)
- createdAt

---

### Issue
- id (uuid, PK)
- gitlabIid (unique)
- title
- userId (FK)
- createdAt

---

## Prisma Schema (recommended)

```prisma
model User {
  id           String   @id @default(uuid())
  email        String   @unique
  passwordHash String
  role         String   @default("user")
  createdAt    DateTime @default(now())

  issues       Issue[]
}

model Invite {
  id        String   @id @default(uuid())
  code      String   @unique
  used      Boolean  @default(false)
  usedBy    String?
  createdAt DateTime @default(now())
}

model Issue {
  id         String   @id @default(uuid())
  gitlabIid  Int      @unique
  title      String
  userId     String
  createdAt  DateTime @default(now())

  user       User     @relation(fields: [userId], references: [id])
}
```

---

## Auth System

### POST /api/auth/register

- If email in ADMIN_EMAILS → bypass invite
- Else require valid invite
- Hash password (bcrypt)
- Create user
- Mark invite used
- Set session cookie

---

### POST /api/auth/login

- Validate credentials
- Set session cookie

---

### POST /api/auth/logout

- Clear session

---

### GET /api/auth/me

- Return current user

---

## Session

- Cookie-based session
- Store user_id
- HTTP-only cookie

lib/auth.ts:
- getCurrentUser()
- requireAuth()

---

## Admin System

### Admin Definition

Admin if:
- email in ADMIN_EMAILS OR
- role === 'admin' in DB

---

### POST /api/admin/promote

- Promote user to admin

---

### POST /api/admin/demote

- Demote admin
- Prevent self-demotion
- Ensure at least 1 admin remains

---

### Invite Management

#### POST /api/admin/invites
- Generate invite code (UUID)

#### GET /api/admin/invites
- List invites

---

## Issue Rules

- Only authenticated users can create issues
- Store userId
- Only show issues created via this app

---

## API Routes

### POST /api/issues
- Create GitLab issue
- Save to Postgres

### GET /api/issues
- Return user’s issues only

### GET /api/issues/[iid]
- Only if exists in DB

### POST /api/issues/[iid]/notes
- Only if exists and user has access

---

## Frontend Pages

### /login
- login form

### /register
- register + invite

### /issues
- user issue list

### /issues/new
- create issue

### /issues/[iid]
- detail + comments

### /admin
- manage invites + admins

---

## Security Rules

- All issue APIs require auth
- Admin APIs require admin
- Invite codes single-use
- Password hashed
- ENV admins always admin

---

## Optional Enhancements

- Rate limiting
- Email verification
- AI translation (CN → EN)
- Issue templates

---

## Final Goal

A production-ready KiCad issue bridge:

- Chinese users submit issues to GitLab
- Access controlled via invites
- Admins manage platform
- Clean, scalable PostgreSQL backend
