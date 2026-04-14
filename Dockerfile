# ---------- 1. Builder stage ----------
FROM node:22 AS builder

WORKDIR /app

# Build arguments (DO NOT persist secrets in ENV)
ARG GITLAB_PROJECT_ID=15502567
ARG GITLAB_BASE_URL=https://gitlab.com/api/v4

ENV NODE_ENV=production \
    GITLAB_PROJECT_ID=${GITLAB_PROJECT_ID} \
    GITLAB_BASE_URL=${GITLAB_BASE_URL}

# Enable pnpm via corepack
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install dependencies first (better caching)
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# Build Next.js app
RUN pnpm build


# ---------- 2. Runner stage ----------
FROM node:22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV NEXT_PUBLIC_ENV=production
ENV DB_PATH=/data/issues.db

# Create persistent data directory
RUN mkdir -p /data

# Enable pnpm in runtime (only needed if you use pnpm start)
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install only production dependencies
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Optional: ensure correct permissions
RUN chown -R node:node /app /data

USER node

VOLUME ["/data"]

EXPOSE 3000

CMD ["pnpm", "start"]