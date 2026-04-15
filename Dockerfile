# ---------- 1. Builder stage ----------
FROM node:22 AS builder

WORKDIR /app

# Install native build tools (required for sqlite3)
RUN apt-get update && apt-get install -y \
  python3 \
  make \
  g++ \
  && rm -rf /var/lib/apt/lists/*

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy dependency files first (for caching)
COPY package.json pnpm-lock.yaml* ./

# 🔥 IMPORTANT: allow native build scripts
RUN pnpm install --frozen-lockfile --ignore-scripts=false

# Copy source
COPY . .

# Ensure sqlite3 native binding is built
RUN pnpm rebuild sqlite3

# Build Next.js
RUN pnpm build


# ---------- 2. Runner stage ----------
FROM node:22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV DB_PATH=/data/issues.db

# Create persistent DB folder
RUN mkdir -p /data

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install production deps ONLY
COPY package.json pnpm-lock.yaml* ./

# 🔥 IMPORTANT: allow native build scripts here too
RUN pnpm install --prod --frozen-lockfile --ignore-scripts=false

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.ts ./next.config.ts
COPY --from=builder /app/package.json ./package.json

# Permissions (optional but good practice)
RUN chown -R node:node /app /data

USER node

VOLUME ["/data"]

EXPOSE 3000

CMD ["pnpm", "start"]