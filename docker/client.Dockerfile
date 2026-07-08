############################################
# Base
############################################

FROM node:20-alpine AS base

RUN apk add --no-cache libc6-compat

RUN corepack enable

WORKDIR /app


############################################
# Pruner
############################################

FROM base AS pruner

COPY . .

RUN yarn dlx turbo prune client --docker


############################################
# Installer
############################################

FROM base AS installer

COPY --from=pruner /app/out/json/ .

RUN yarn install --frozen-lockfile


############################################
# Builder
############################################

FROM base AS builder

COPY --from=installer /app/node_modules ./node_modules

COPY --from=pruner /app/out/full/ .

RUN yarn turbo run build --filter=client


############################################
# Runner
############################################

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system nodejs

RUN adduser --system nextjs

USER nextjs

COPY --from=builder /app/apps/client/.next/standalone ./

COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static

COPY --from=builder /app/apps/client/public ./apps/client/public

EXPOSE 3000

ENV PORT=3000

CMD ["node", "apps/client/server.js"]