# ---------- 1. Builder ----------
FROM node:22 AS builder

WORKDIR /app

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY . .

# ✅ Generate Prisma client (use pnpm, not npx)
RUN pnpm prisma generate

# Build Next.js
RUN pnpm build


# ---------- 2. Runner ----------
FROM node:22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Enable pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install ONLY prod deps
COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

# Copy build output
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ✅ CRITICAL: Prisma runtime files
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

# (optional but safe) ensure permissions
RUN chown -R node:node /app

USER node

EXPOSE 3000

# ✅ Auto migrate + start (use pnpm exec, not npx)
CMD ["sh", "-c", "pnpm exec prisma migrate deploy && pnpm start"]