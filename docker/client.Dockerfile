############################################
# Dependencies
############################################

FROM node:20-alpine AS deps

WORKDIR /app

RUN corepack enable

COPY package.json yarn.lock turbo.json ./
COPY apps/client/package.json ./apps/client/package.json

RUN yarn install --frozen-lockfile

############################################
# Builder
############################################

FROM node:20-alpine AS builder

RUN apk add --no-cache libc6-compat

WORKDIR /app

RUN corepack enable

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_BASE_URL
ENV NEXT_PUBLIC_BASE_URL=$NEXT_PUBLIC_BASE_URL

RUN yarn turbo run build --filter=client

############################################
# Runner
############################################

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

RUN addgroup -S nodejs && \
    adduser -S nextjs -G nodejs

COPY --from=builder /app/apps/client/.next/standalone ./
COPY --from=builder /app/apps/client/.next/static ./apps/client/.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "apps/client/server.js"]