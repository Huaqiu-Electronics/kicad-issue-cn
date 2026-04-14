# ---------- 1. Builder stage ----------
FROM node:22-alpine AS builder

WORKDIR /app

# Declare build-time arguments
ARG GITLAB_TOKEN
ARG GITLAB_PROJECT_ID
ARG GITLAB_BASE_URL

# Pass to environment for the build phase
ENV GITLAB_TOKEN=${GITLAB_TOKEN} \
    GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID} \
    GITLAB_BASE_URL=${GITLAB_BASE_URL} \
    NODE_ENV=production

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install

# Build app
COPY . .
RUN pnpm build


# ---------- 2. Runner stage (production) ----------
FROM node:22-alpine AS runner

WORKDIR /app
ENV NODE_ENV=production
ENV PORT=3000

# runtime defaults (can be overridden with docker run -e KEY=...)
ENV NEXT_PUBLIC_ENV="production"
ENV GITLAB_TOKEN=${GITLAB_TOKEN} \
    GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID} \
    GITLAB_BASE_URL=${GITLAB_BASE_URL} \
    DB_PATH=/data/issues.db \
    NODE_ENV=production

# Create data directory for database
RUN mkdir -p /data

# Enable pnpm & install only prod deps
RUN corepack enable && corepack prepare pnpm@latest --activate
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output & static assets
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Volume for persistent database storage
VOLUME ["/data"]

EXPOSE 3000
CMD ["pnpm", "start"]
