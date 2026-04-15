# KiCad Issue CN

A lightweight fullstack GitLab issue bridge built with Next.js and Prisma.

---

## Features

* 📝 Create issues
* 📋 View issues list
* 📄 View issue details
* 💬 Reply to issues (comments)
* 🔄 Sync with GitLab via API
* 🐳 Docker-ready for deployment
* 🗄️ PostgreSQL with Prisma ORM

---

## Tech Stack

* Next.js (App Router)
* TypeScript
* Tailwind CSS
* Prisma ORM
* PostgreSQL
* Docker

---

## Getting Started

### Prerequisites

* Node.js 22+
* pnpm

---

## Environment Variables

Create a `.env` file in the root directory:

```env
# GitLab Configuration
GITLAB_TOKEN=your-gitlab-personal-access-token
GITLAB_PROJECT_ID=52152403
GITLAB_BASE_URL=https://gitlab.com/api/v4

# Database (local dev)
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/kicad
```

---

## Development

### 1. Install dependencies

```bash
pnpm install
```

### 2. Setup database

Make sure PostgreSQL is running locally, then:

```bash
pnpm prisma migrate dev
```

### 3. Start dev server

```bash
pnpm dev
```

Open http://localhost:3000

---

## Production Build

```bash
pnpm build
pnpm start
```

---

# 🐳 Docker Deployment

## Option 1: Using docker-compose (Recommended)

### docker-compose.yml

```yaml
services:
  db:
    image: postgres:16
    restart: always
    environment:
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
      POSTGRES_DB: kicad
    volumes:
      - pgdata:/var/lib/postgresql/data
    ports:
      - "5432:5432"

  app:
    image: registry.cn-shanghai.aliyuncs.com/kicad/kicad-issue-cn:latest
    ports:
      - "3000:3000"
    env_file:
      - .env
    depends_on:
      - db

volumes:
  pgdata:
```

### Important

Inside Docker, use:

```env
DATABASE_URL=postgresql://postgres:postgres@db:5432/kicad
```

NOT `localhost`.

---

### Run

```bash
docker compose up -d
```

---

## Option 2: Using docker run

```bash
docker run -d \
  -p 3000:3000 \
  -e GITLAB_TOKEN=your-token \
  -e GITLAB_PROJECT_ID=52152403 \
  -e GITLAB_BASE_URL=https://gitlab.com/api/v4 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/kicad \
  ghcr.io/huaqiu-electronics/kicad-issue-cn:latest 
```


- If you can not access github:

```bash
docker run -d \
  -p 3000:3000 \
  -e GITLAB_TOKEN=your-token \
  -e GITLAB_PROJECT_ID=52152403 \
  -e GITLAB_BASE_URL=https://gitlab.com/api/v4 \
  -e DATABASE_URL=postgresql://postgres:postgres@host.docker.internal:5432/kicad \
  registry.cn-shanghai.aliyuncs.com/kicad/kicad-issue-cn:latest 
```


---

## Option 3: Build image locally

```bash
docker build -t kicad-issue-cn .
```

Run:

```bash
docker run -d \
  -p 3000:3000 \
  --env-file .env \
  kicad-issue-cn
```

---

## Database Notes

* Uses PostgreSQL (via Prisma)
* Run migrations before production use:

```bash
pnpm prisma migrate deploy
```

---

## API Routes

| Method | Endpoint                | Description         |
| ------ | ----------------------- | ------------------- |
| POST   | /api/issues             | Create a new issue  |
| GET    | /api/issues             | List all issues     |
| GET    | /api/issues/[iid]       | Get issue details   |
| GET    | /api/issues/[iid]/notes | List issue comments |
| POST   | /api/issues/[iid]/notes | Add a comment       |

---

## Development with Docker

```bash
docker compose up --build
```

---

## Common Pitfalls

### ❌ Using localhost in Docker

Inside containers, always use service name:

```
db  ✅
localhost ❌
```

---

### ❌ Missing env variables

App will fail if these are not set:

* GITLAB_TOKEN
* DATABASE_URL

---

### ❌ Prisma issues

If schema changes:

```bash
pnpm prisma generate
pnpm prisma migrate deploy
```

---

## License

MIT
