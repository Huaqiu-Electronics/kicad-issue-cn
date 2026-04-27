> From: https://chatgpt.com/c/69ef78f8-1974-8331-a6ca-e8a9b625de01


# Task: Support GET-based Issue Submission + Guest Issue Moderation Flow

## Background

In discussions with Seth Hillbrand, KiCad currently redirects bug reports directly to GitLab.

We are introducing a **China-specific issue portal** with the following constraints:

1. KiCad client may send **GET requests** (not POST)
2. Users without:
   - invitation code
   - registered account  
   must still be able to submit issues
3. These submissions:
   - are **NOT immediately posted to GitLab**
   - are stored as **guest issues**
   - must be **reviewed by a registered user**
4. Only after review:
   - issue is submitted to GitLab via API
   - or discarded

This app **does not track issues independently** — GitLab remains the source of truth.

---

## Goals

### 1. Support GET-based Issue Submission
Allow KiCad client to submit issues via:

```
GET /api/issues/submit
```

With query parameters:
- `title`
- `description`
- `labels` (optional, comma-separated)
- `version` (optional)
- `platform` (optional)

---

### 2. Guest Issue Flow

If the request:
- has **no authenticated session**
- OR is flagged as **external (KiCad redirect)**

Then:
- Create a **Guest Issue**
- DO NOT call GitLab API yet

---

### 3. Moderation Workflow

Registered users can:
- View pending guest issues
- Approve → submit to GitLab
- Reject → delete or mark as cancelled

---

## Required Changes

### 1. Database Schema Update (Prisma)

Add new model:

```prisma
model GuestIssue {
  id          String   @id @default(uuid())
  title       String
  description String
  labels      String?
  status      String   @default("pending") // pending | approved | rejected
  createdAt   DateTime @default(now())

  // Optional metadata
  version     String?
  platform    String?

  // After approval
  gitlabIid   Int?
  reviewerId  String?
}
```

---

### 2. API: GET Issue Submission Endpoint

Create new route:

```
app/api/issues/submit/route.ts
```

#### Behavior:

- Accept **GET request**
- Parse query params
- Detect user session via `lib/auth.ts`

#### Logic:

```ts
if (userLoggedIn) {
  // existing behavior
  create GitLab issue directly
} else {
  // new behavior
  create GuestIssue
}
```

#### Response:

- For guest:
```json
{ "status": "pending_review" }
```

- For logged-in:
```json
{ "status": "created", "gitlabIid": number }
```

---

### 3. Admin / Reviewer APIs

#### List guest issues

```
GET /api/admin/guest-issues
```

- Only accessible to logged-in users
- Returns all `status = pending`

---

#### Approve guest issue

```
POST /api/admin/guest-issues/{id}/approve
```

Steps:
1. Fetch GuestIssue
2. Call `lib/gitlab.ts` → create issue
3. Update:
   - `status = approved`
   - `gitlabIid`
   - `reviewerId`

---

#### Reject guest issue

```
POST /api/admin/guest-issues/{id}/reject
```

Steps:
- Update `status = rejected`

---

### 4. GitLab Integration

Reuse existing:

```
lib/gitlab.ts
```

No architectural change needed, but:

- Ensure **idempotency** (avoid duplicate submissions)
- Add logging for moderation actions

---

### 5. UI Changes

#### Admin Dashboard

Add section:

```
Pending Guest Issues
```

Display:
- title
- description
- metadata (version/platform)
- createdAt

Actions:
- ✅ Approve
- ❌ Reject

---

### 6. Security Considerations

- Rate limit GET endpoint (basic protection)
- Sanitize inputs (title/description)
- Prevent duplicate spam:
  - optional: hash(title + description)

---

### 7. Optional Enhancements (Nice-to-have)

- Auto-tag guest issues with:
  ```
  label: cn-user
  ```
- Add bot user (e.g. `cn-users`) for GitLab submissions
- Add webhook sync after approval (already supported)

---

## Acceptance Criteria

- [ ] GET `/api/issues/submit` works without authentication
- [ ] Guest issues are stored in DB
- [ ] No GitLab issue is created for guest submissions initially
- [ ] Admin can:
  - [ ] view pending guest issues
  - [ ] approve → creates GitLab issue
  - [ ] reject → marks as rejected
- [ ] Approved issues store `gitlabIid`
- [ ] System does not break existing POST `/api/issues`

---

## Notes for Implementation

- Follow existing patterns in:
  - `app/api/issues/route.ts`
  - `lib/gitlab.ts`
  - `lib/auth.ts`
- Keep logic minimal and composable
- Avoid duplicating GitLab logic


After complete the task ,you'd change the original gitlab issue url in the kicad source code to our's which is running at localhost:3000