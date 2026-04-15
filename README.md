# KiCad Issue CN

A lightweight fullstack GitLab issue bridge built with Next.js.

## Features

- 📝 Create issues
- 📋 View issues list
- 📄 View issue details
- 💬 Reply to issues (comments)
- 📡 Webhook receiver for GitLab events
- 🐳 Docker support for deployment

## Tech Stack

- **Next.js 16+** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **SQLite** (for future enhancements)

## Getting Started

### Prerequisites

- Node.js 22+
- pnpm (or npm/yarn)

### Environment Variables

Create a `.env` file in the root directory:

```env
GITLAB_TOKEN=your-gitlab-personal-access-token
GITLAB_PROJECT_ID=15502567  # Default value
GITLAB_BASE_URL=https://gitlab.com/api/v4  # Default value
```

### Development

```bash
# Install dependencies
pnpm install

# Start development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Build for Production

```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## Docker Deployment

The project includes a Dockerfile for containerized deployment.

### Build Docker Image

```bash
docker build -t kicad-issue-cn .
```

### Run Docker Container

```bash
docker run -d \
  -p 3000:3000 \
  -e GITLAB_TOKEN=your-token \
  -v kicad-issue-data:/data \
  kicad-issue-cn
```

### Default Configuration

- **GitLab Project ID**: `15502567`
- **GitLab Base URL**: `https://gitlab.com/api/v4`
- **Database Path**: `/data/issues.db` (persistent via volume)

## API Routes

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/issues` | Create a new issue |
| GET | `/api/issues` | List all issues |
| GET | `/api/issues/[iid]` | Get issue details |
| GET | `/api/issues/[iid]/notes` | List issue comments |
| POST | `/api/issues/[iid]/notes` | Add a comment |
| POST | `/api/webhook/gitlab` | Receive GitLab webhook events |


## Development
```bash
docker compose up --build
```
