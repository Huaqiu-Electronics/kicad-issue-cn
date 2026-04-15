FROM node:22 AS builder

WORKDIR /app

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY . .

RUN pnpm install --frozen-lockfile
RUN pnpm prisma generate
RUN pnpm build


FROM node:22 AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN corepack enable && corepack prepare pnpm@latest --activate

COPY package.json pnpm-lock.yaml* ./
RUN pnpm install --prod --frozen-lockfile

COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

# ✅ IMPORTANT: regenerate Prisma in runtime env
RUN pnpm prisma generate

RUN chown -R node:node /app
USER node

EXPOSE 3000

CMD ["pnpm", "start"]